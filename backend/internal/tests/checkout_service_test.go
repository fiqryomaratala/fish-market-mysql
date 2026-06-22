package tests

import (
	"fmt"
	"testing"
	"time"

	"github.com/fiqryomaratala/backend/internal/mocks"
	"github.com/fiqryomaratala/backend/internal/models"
	"github.com/fiqryomaratala/backend/internal/services"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func TestCheckoutServiceCheckoutSuccess(t *testing.T) {
	SetupTest(t)

	var createdOrder *models.Order
	var createdItems []models.OrderItem
	cartRepo := &mocks.MockCartRepository{
		FindByUserIDFunc: func(userID uint) ([]models.Cart, error) {
			return []models.Cart{
				{
					Model:     models.Cart{}.Model,
					ProductID: 1,
					Quantity:  2,
					Product:   models.Product{Model: gorm.Model{ID: 1}, Name: "Ikan Nila", Price: 35000, Status: "available"},
				},
			}, nil
		},
		DeleteByUserIDFunc: func(userID uint) error {
			return nil
		},
	}
	orderRepo := &mocks.MockOrderRepository{
		CountByYearFunc: func(year int) (int64, error) {
			assert.Equal(t, time.Now().Year(), year)
			return 0, nil
		},
		CreateFunc: func(order *models.Order) error {
			order.ID = 1
			createdOrder = order
			return nil
		},
		CreateItemsFunc: func(items []models.OrderItem) error {
			createdItems = items
			return nil
		},
	}
	inventoryService := &mocks.MockInventoryService{
		DeductProductInventoryFunc: func(productID uint, quantity float64, reference string, description string, audit *services.AuditContext) error {
			assert.Equal(t, uint(1), productID)
			assert.Equal(t, float64(2), quantity)
			assert.Equal(t, "Checkout Order", description)
			return nil
		},
	}

	service := services.NewCheckoutServiceWithDependencies(cartRepo, orderRepo, inventoryService)
	result, err := service.Checkout(services.CheckoutInput{
		UserID:          5,
		ShippingAddress: "Jl. Laut 123",
	})

	assert.NoError(t, err)
	assert.NotNil(t, result)
	assert.Equal(t, fmt.Sprintf("INV-%d-000001", time.Now().Year()), result.Invoice)
	assert.NotNil(t, createdOrder)
	assert.Equal(t, "pending", createdOrder.Status)
	assert.Equal(t, "unpaid", createdOrder.PaymentStatus)
	assert.Equal(t, float64(70000), createdOrder.TotalPrice)
	assert.Len(t, createdItems, 1)
	assert.Equal(t, uint(1), createdItems[0].OrderID)
	assert.Equal(t, float64(70000), createdItems[0].Subtotal)
}

func TestCheckoutServiceCartEmpty(t *testing.T) {
	SetupTest(t)

	service := services.NewCheckoutServiceWithDependencies(
		&mocks.MockCartRepository{
			FindByUserIDFunc: func(userID uint) ([]models.Cart, error) {
				return []models.Cart{}, nil
			},
		},
		&mocks.MockOrderRepository{},
		&mocks.MockInventoryService{},
	)

	result, err := service.Checkout(services.CheckoutInput{UserID: 5})

	assert.ErrorIs(t, err, services.ErrCartEmpty)
	assert.Nil(t, result)
}

func TestCheckoutServiceInventoryNotEnough(t *testing.T) {
	SetupTest(t)

	service := services.NewCheckoutServiceWithDependencies(
		&mocks.MockCartRepository{
			FindByUserIDFunc: func(userID uint) ([]models.Cart, error) {
				return []models.Cart{
					{
						Model:     models.Cart{}.Model,
						ProductID: 1,
						Quantity:  3,
						Product:   models.Product{Model: gorm.Model{ID: 1}, Name: "Ikan Nila", Price: 35000, Status: "available"},
					},
				}, nil
			},
		},
		&mocks.MockOrderRepository{
			CountByYearFunc: func(year int) (int64, error) {
				return 0, nil
			},
		},
		&mocks.MockInventoryService{
			DeductProductInventoryFunc: func(productID uint, quantity float64, reference string, description string, audit *services.AuditContext) error {
				return services.ErrInsufficientInventory
			},
		},
	)

	result, err := service.Checkout(services.CheckoutInput{UserID: 5})

	assert.ErrorIs(t, err, services.ErrInsufficientInventory)
	assert.Nil(t, result)
}
