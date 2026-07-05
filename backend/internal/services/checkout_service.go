package services

import (
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/fiqryomaratala/backend/config"
	"github.com/fiqryomaratala/backend/internal/dto"
	"github.com/fiqryomaratala/backend/internal/helpers"
	"github.com/fiqryomaratala/backend/internal/logger"
	"github.com/fiqryomaratala/backend/internal/models"
	"github.com/fiqryomaratala/backend/internal/repositories"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

var ErrCartEmpty = errors.New("cart is empty")
var ErrOnlinePaymentUnavailable = errors.New("online payment is unavailable")

type CheckoutInput struct {
	UserID          uint
	ShippingAddress string
	PaymentMethod   string
	Audit           *AuditContext
}

type CheckoutService interface {
	Checkout(input CheckoutInput) (*dto.CheckoutResponse, error)
}

type checkoutService struct {
	db               *gorm.DB
	cartRepo         repositories.CartRepository
	orderRepo        repositories.OrderRepository
	userRepo         repositories.UserRepository
	inventoryService InventoryService
	paymentGateway   PaymentGatewayService
}

func NewCheckoutService(
	db *gorm.DB,
) CheckoutService {
	cfg := config.GetConfig()
	return &checkoutService{
		db:             db,
		paymentGateway: NewXenditPaymentService(cfg),
	}
}

func NewCheckoutServiceWithDependencies(
	cartRepo repositories.CartRepository,
	orderRepo repositories.OrderRepository,
	inventoryService InventoryService,
) CheckoutService {
	return NewCheckoutServiceWithOptionalDependencies(cartRepo, orderRepo, nil, inventoryService, nil)
}

func NewCheckoutServiceWithOptionalDependencies(
	cartRepo repositories.CartRepository,
	orderRepo repositories.OrderRepository,
	userRepo repositories.UserRepository,
	inventoryService InventoryService,
	paymentGateway ...PaymentGatewayService,
) CheckoutService {
	var gateway PaymentGatewayService
	if len(paymentGateway) > 0 {
		gateway = paymentGateway[0]
	}

	return &checkoutService{
		cartRepo:         cartRepo,
		orderRepo:        orderRepo,
		userRepo:         userRepo,
		inventoryService: inventoryService,
		paymentGateway:   gateway,
	}
}

func (s *checkoutService) Checkout(input CheckoutInput) (*dto.CheckoutResponse, error) {
	var result *dto.CheckoutResponse
	logger.Info("checkout started", zap.String("module", "ORDER"), zap.Uint("user_id", input.UserID))
	var err error
	if s.db != nil {
		err = s.db.Transaction(func(tx *gorm.DB) error {
			cartRepo := repositories.NewCartRepository(tx)
			orderRepo := repositories.NewOrderRepository(tx)
			productRepo := repositories.NewProductRepository(tx)
			inventoryRepo := repositories.NewInventoryRepository(tx)
			transactionRepo := repositories.NewInventoryTransactionRepository(tx)
			userRepo := repositories.NewUserRepository(tx)
			inventoryService := NewInventoryService(inventoryRepo, transactionRepo, productRepo)

			var processErr error
			result, processErr = s.processCheckout(input, cartRepo, orderRepo, userRepo, inventoryService)
			return processErr
		})
	} else {
		result, err = s.processCheckout(input, s.cartRepo, s.orderRepo, s.userRepo, s.inventoryService)
	}
	if err != nil {
		logger.Error("checkout failed", err, zap.String("module", "ORDER"), zap.Uint("user_id", input.UserID))
		return nil, err
	}

	if input.Audit != nil {
		helpers.LogActivity(
			input.Audit.UserID,
			"CREATE",
			"ORDER",
			"Checkout order "+result.Invoice,
			input.Audit.IPAddress,
			input.Audit.UserAgent,
		)
	}

	helpers.CreateNotification(
		input.UserID,
		"Pesanan Berhasil Dibuat",
		"Pesanan "+result.Invoice+" berhasil dibuat dan sedang menunggu proses lebih lanjut.",
		"ORDER",
		"ORDER",
		0,
	)

	logger.Info("checkout successful", zap.String("module", "ORDER"), zap.Uint("user_id", input.UserID), zap.String("invoice", result.Invoice))

	return result, nil
}

func (s *checkoutService) processCheckout(
	input CheckoutInput,
	cartRepo repositories.CartRepository,
	orderRepo repositories.OrderRepository,
	userRepo repositories.UserRepository,
	inventoryService InventoryService,
) (*dto.CheckoutResponse, error) {
	cartItems, err := cartRepo.FindByUserID(input.UserID)
	if err != nil {
		logger.Error("failed to load cart items during checkout", err, zap.String("module", "ORDER"), zap.Uint("user_id", input.UserID))
		return nil, err
	}

	activeCartItems := make([]models.Cart, 0, len(cartItems))
	for _, item := range cartItems {
		if item.Product.ID == 0 || item.Product.Status == "hidden" {
			itemToDelete := item
			if err := cartRepo.Delete(&itemToDelete); err != nil {
				return nil, err
			}
			continue
		}

		activeCartItems = append(activeCartItems, item)
	}

	if len(activeCartItems) == 0 {
		return nil, ErrCartEmpty
	}

	invoiceNumber, err := s.generateInvoiceNumber(orderRepo)
	if err != nil {
		logger.Error("failed to generate invoice during checkout", err, zap.String("module", "ORDER"), zap.Uint("user_id", input.UserID))
		return nil, err
	}

	totalPrice := 0.0
	orderItems := make([]models.OrderItem, 0, len(activeCartItems))
	for _, cartItem := range activeCartItems {
		if err := inventoryService.DeductProductInventory(
			cartItem.ProductID,
			float64(cartItem.Quantity),
			invoiceNumber,
			"Checkout Order",
			input.Audit,
		); err != nil {
			return nil, err
		}

		subtotal := float64(cartItem.Quantity) * cartItem.Product.Price
		totalPrice += subtotal

		orderItems = append(orderItems, models.OrderItem{
			ProductID: cartItem.ProductID,
			Quantity:  cartItem.Quantity,
			Price:     cartItem.Product.Price,
			Subtotal:  subtotal,
		})
	}

	order := &models.Order{
		UserID:          input.UserID,
		InvoiceNumber:   invoiceNumber,
		TotalPrice:      totalPrice,
		Status:          "pending",
		PaymentStatus:   "unpaid",
		PaymentMethod:   normalizePaymentMethod(input.PaymentMethod),
		PaymentProvider: resolvePaymentProvider(input.PaymentMethod),
		ShippingAddress: strings.TrimSpace(input.ShippingAddress),
	}

	if err := orderRepo.Create(order); err != nil {
		logger.Error("failed to create order during checkout", err, zap.String("module", "ORDER"), zap.String("invoice", invoiceNumber))
		return nil, err
	}

	if shouldCreatePaymentLink(order.PaymentMethod) {
		expiresAt := time.Now().Add(24 * time.Hour)
		order.ExpiresAt = &expiresAt

		if s.paymentGateway == nil || userRepo == nil {
			return nil, ErrOnlinePaymentUnavailable
		}

		user, err := userRepo.FindByID(input.UserID)
		if err != nil {
			return nil, err
		}
		if user == nil {
			return nil, ErrOnlinePaymentUnavailable
		}

		frontendURL := strings.TrimRight(config.GetConfig().FrontendURL, "/")
		paymentLink, err := s.paymentGateway.CreatePaymentLink(CreatePaymentLinkInput{
			ExternalID:         invoiceNumber,
			Amount:             totalPrice,
			PayerName:          strings.TrimSpace(user.Name),
			PayerEmail:         strings.TrimSpace(user.Email),
			Description:        "Pembayaran pesanan " + invoiceNumber,
			SuccessRedirectURL: fmt.Sprintf("%s/orders/success/%d", frontendURL, order.ID),
			FailureRedirectURL: fmt.Sprintf("%s/orders/%d", frontendURL, order.ID),
		})
		if err != nil {
			if errors.Is(err, ErrPaymentGatewayNotConfigured) {
				return nil, ErrOnlinePaymentUnavailable
			}
			return nil, err
		}

		order.PaymentLinkID = paymentLink.ID
		order.PaymentLinkURL = paymentLink.InvoiceURL
		if err := orderRepo.Update(order); err != nil {
			return nil, err
		}
	}

	for index := range orderItems {
		orderItems[index].OrderID = order.ID
	}
	if err := orderRepo.CreateItems(orderItems); err != nil {
		logger.Error("failed to create order items during checkout", err, zap.String("module", "ORDER"), zap.String("invoice", invoiceNumber))
		return nil, err
	}

	if err := cartRepo.DeleteByUserID(input.UserID); err != nil {
		return nil, err
	}

	return &dto.CheckoutResponse{
		OrderID:       order.ID,
		Invoice:       invoiceNumber,
		Total:         totalPrice,
		Status:        order.Status,
		PaymentStatus: order.PaymentStatus,
		PaymentMethod: order.PaymentMethod,
		PaymentURL:    order.PaymentLinkURL,
		CreatedAt:     order.CreatedAt.UTC().Format(time.RFC3339),
	}, nil
}

func (s *checkoutService) generateInvoiceNumber(orderRepo repositories.OrderRepository) (string, error) {
	year := time.Now().Year()
	total, err := orderRepo.CountByYear(year)
	if err != nil {
		return "", err
	}

	return fmt.Sprintf("INV-%d-%06d", year, total+1), nil
}

func normalizePaymentMethod(value string) string {
	method := strings.TrimSpace(strings.ToLower(value))
	switch method {
	case "bank_transfer", "e_wallet", "cod":
		return method
	default:
		return "bank_transfer"
	}
}

func resolvePaymentProvider(method string) string {
	if normalizePaymentMethod(method) == "cod" {
		return "manual"
	}

	return "xendit"
}

func shouldCreatePaymentLink(method string) bool {
	return normalizePaymentMethod(method) != "cod"
}
