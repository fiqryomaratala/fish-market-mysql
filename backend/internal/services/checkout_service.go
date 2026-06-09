package services

import (
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/fiqryomaratala/backend/internal/dto"
	"github.com/fiqryomaratala/backend/internal/helpers"
	"github.com/fiqryomaratala/backend/internal/models"
	"github.com/fiqryomaratala/backend/internal/repositories"
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
	db *gorm.DB
}

func NewCheckoutService(
	db *gorm.DB,
) CheckoutService {
	return &checkoutService{
		db: db,
	}
}

func (s *checkoutService) Checkout(input CheckoutInput) (*dto.CheckoutResponse, error) {
	invoiceNumber := ""
	err := s.db.Transaction(func(tx *gorm.DB) error {
		cartRepo := repositories.NewCartRepository(tx)
		orderRepo := repositories.NewOrderRepository(tx)
		productRepo := repositories.NewProductRepository(tx)
		inventoryRepo := repositories.NewInventoryRepository(tx)
		transactionRepo := repositories.NewInventoryTransactionRepository(tx)
		inventoryService := NewInventoryService(inventoryRepo, transactionRepo, productRepo)

		cartItems, err := cartRepo.FindByUserID(input.UserID)
		if err != nil {
			return err
		}
		if len(cartItems) == 0 {
			return ErrCartEmpty
		}

		invoiceNumber, err = s.generateInvoiceNumber(orderRepo)
		if err != nil {
			return err
		}

		totalPrice := 0.0
		orderItems := make([]models.OrderItem, 0, len(cartItems))
		for _, cartItem := range cartItems {
			if err := inventoryService.DeductProductInventory(
				cartItem.ProductID,
				float64(cartItem.Quantity),
				invoiceNumber,
				"Checkout Order",
			); err != nil {
				return err
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
			return err
		}

		for index := range orderItems {
			orderItems[index].OrderID = order.ID
		}
		if err := orderRepo.CreateItems(orderItems); err != nil {
			return err
		}

		return cartRepo.DeleteByUserID(input.UserID)
	})
	if err != nil {
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

	return &dto.CheckoutResponse{Invoice: invoiceNumber}, nil
}

func (s *checkoutService) generateInvoiceNumber(orderRepo repositories.OrderRepository) (string, error) {
	year := time.Now().Year()
	total, err := orderRepo.CountByYear(year)
	if err != nil {
		return "", err
	}

	return fmt.Sprintf("INV-%d-%06d", year, total+1), nil
}
