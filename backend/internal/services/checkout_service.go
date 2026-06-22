package services

import (
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/fiqryomaratala/backend/internal/dto"
	"github.com/fiqryomaratala/backend/internal/helpers"
	"github.com/fiqryomaratala/backend/internal/logger"
	"github.com/fiqryomaratala/backend/internal/models"
	"github.com/fiqryomaratala/backend/internal/repositories"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

var ErrCartEmpty = errors.New("cart is empty")

type CheckoutInput struct {
	UserID          uint
	ShippingAddress string
	Audit           *AuditContext
}

type CheckoutService interface {
	Checkout(input CheckoutInput) (*dto.CheckoutResponse, error)
}

type checkoutService struct {
	db               *gorm.DB
	cartRepo         repositories.CartRepository
	orderRepo        repositories.OrderRepository
	inventoryService InventoryService
}

func NewCheckoutService(
	db *gorm.DB,
) CheckoutService {
	return &checkoutService{
		db: db,
	}
}

func NewCheckoutServiceWithDependencies(
	cartRepo repositories.CartRepository,
	orderRepo repositories.OrderRepository,
	inventoryService InventoryService,
) CheckoutService {
	return &checkoutService{
		cartRepo:         cartRepo,
		orderRepo:        orderRepo,
		inventoryService: inventoryService,
	}
}

func (s *checkoutService) Checkout(input CheckoutInput) (*dto.CheckoutResponse, error) {
	invoiceNumber := ""
	logger.Info("checkout started", zap.String("module", "ORDER"), zap.Uint("user_id", input.UserID))
	var err error
	if s.db != nil {
		err = s.db.Transaction(func(tx *gorm.DB) error {
			cartRepo := repositories.NewCartRepository(tx)
			orderRepo := repositories.NewOrderRepository(tx)
			productRepo := repositories.NewProductRepository(tx)
			inventoryRepo := repositories.NewInventoryRepository(tx)
			transactionRepo := repositories.NewInventoryTransactionRepository(tx)
			inventoryService := NewInventoryService(inventoryRepo, transactionRepo, productRepo)

			var processErr error
			invoiceNumber, processErr = s.processCheckout(input, cartRepo, orderRepo, inventoryService)
			return processErr
		})
	} else {
		invoiceNumber, err = s.processCheckout(input, s.cartRepo, s.orderRepo, s.inventoryService)
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
			"Checkout order "+invoiceNumber,
			input.Audit.IPAddress,
			input.Audit.UserAgent,
		)
	}

	helpers.CreateNotification(
		input.UserID,
		"Order Created",
		"Order "+invoiceNumber+" berhasil dibuat.",
		"ORDER",
		"ORDER",
		0,
	)

	logger.Info("checkout successful", zap.String("module", "ORDER"), zap.Uint("user_id", input.UserID), zap.String("invoice", invoiceNumber))

	return &dto.CheckoutResponse{Invoice: invoiceNumber}, nil
}

func (s *checkoutService) processCheckout(
	input CheckoutInput,
	cartRepo repositories.CartRepository,
	orderRepo repositories.OrderRepository,
	inventoryService InventoryService,
) (string, error) {
	cartItems, err := cartRepo.FindByUserID(input.UserID)
	if err != nil {
		logger.Error("failed to load cart items during checkout", err, zap.String("module", "ORDER"), zap.Uint("user_id", input.UserID))
		return "", err
	}

	activeCartItems := make([]models.Cart, 0, len(cartItems))
	for _, item := range cartItems {
		if item.Product.ID == 0 || item.Product.Status == "hidden" {
			itemToDelete := item
			if err := cartRepo.Delete(&itemToDelete); err != nil {
				return "", err
			}
			continue
		}

		activeCartItems = append(activeCartItems, item)
	}

	if len(activeCartItems) == 0 {
		return "", ErrCartEmpty
	}

	invoiceNumber, err := s.generateInvoiceNumber(orderRepo)
	if err != nil {
		logger.Error("failed to generate invoice during checkout", err, zap.String("module", "ORDER"), zap.Uint("user_id", input.UserID))
		return "", err
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
			return "", err
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
		ShippingAddress: strings.TrimSpace(input.ShippingAddress),
	}

	if err := orderRepo.Create(order); err != nil {
		logger.Error("failed to create order during checkout", err, zap.String("module", "ORDER"), zap.String("invoice", invoiceNumber))
		return "", err
	}

	for index := range orderItems {
		orderItems[index].OrderID = order.ID
	}
	if err := orderRepo.CreateItems(orderItems); err != nil {
		logger.Error("failed to create order items during checkout", err, zap.String("module", "ORDER"), zap.String("invoice", invoiceNumber))
		return "", err
	}

	if err := cartRepo.DeleteByUserID(input.UserID); err != nil {
		return "", err
	}

	return invoiceNumber, nil
}

func (s *checkoutService) generateInvoiceNumber(orderRepo repositories.OrderRepository) (string, error) {
	year := time.Now().Year()
	total, err := orderRepo.CountByYear(year)
	if err != nil {
		return "", err
	}

	return fmt.Sprintf("INV-%d-%06d", year, total+1), nil
}
