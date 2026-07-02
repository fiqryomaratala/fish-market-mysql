package tests

import (
	"testing"

	"github.com/fiqryomaratala/backend/internal/mocks"
	"github.com/fiqryomaratala/backend/internal/models"
	"github.com/fiqryomaratala/backend/internal/repositories"
	"github.com/fiqryomaratala/backend/internal/services"
	"github.com/stretchr/testify/assert"
)

func TestOrderServiceCreateOrderItemMapping(t *testing.T) {
	SetupTest(t)

	orderRepo := &mocks.MockOrderRepository{
		FindByIDFunc: func(id uint) (*models.Order, error) {
			return sampleOrder(), nil
		},
	}

	service := services.NewOrderService(orderRepo)
	order, err := service.GetByID(1, 7, "customer")

	assert.NoError(t, err)
	assert.NotNil(t, order)
	assert.Len(t, order.Items, 1)
	assert.Equal(t, "Ikan Nila", order.Items[0].Product)
	assert.Equal(t, float64(70000), order.Items[0].Subtotal)
}

func TestOrderServiceGetAll(t *testing.T) {
	SetupTest(t)

	orderRepo := &mocks.MockOrderRepository{
		FindAllFunc: func(filter repositories.OrderFilter) ([]models.Order, int64, error) {
			assert.Equal(t, uint(5), filter.UserID)
			return []models.Order{*sampleOrder()}, 1, nil
		},
	}

	service := services.NewOrderService(orderRepo)
	orders, meta, err := service.GetAll(services.OrderListParams{
		Page:   1,
		Limit:  10,
		UserID: 5,
		Role:   "customer",
	})

	assert.NoError(t, err)
	assert.Len(t, orders, 1)
	assert.Equal(t, int64(1), meta["total"])
}

func TestOrderServicePaymentUpdate(t *testing.T) {
	SetupTest(t)

	order := sampleOrder()
	orderRepo := &mocks.MockOrderRepository{
		FindByIDFunc: func(id uint) (*models.Order, error) {
			return order, nil
		},
		UpdateFunc: func(updated *models.Order) error {
			order.PaymentStatus = updated.PaymentStatus
			return nil
		},
	}

	service := services.NewOrderService(orderRepo)
	result, err := service.UpdatePayment(1, services.UpdateOrderPaymentInput{
		PaymentStatus: "paid",
	})

	assert.NoError(t, err)
	assert.NotNil(t, result)
	assert.Equal(t, "paid", result.PaymentStatus)
}

func TestOrderServiceStatusUpdate(t *testing.T) {
	SetupTest(t)

	order := sampleOrder()
	orderRepo := &mocks.MockOrderRepository{
		FindByIDFunc: func(id uint) (*models.Order, error) {
			return order, nil
		},
		UpdateFunc: func(updated *models.Order) error {
			order.Status = updated.Status
			return nil
		},
	}

	service := services.NewOrderService(orderRepo)
	result, err := service.UpdateStatus(1, services.UpdateOrderStatusInput{
		Status: "completed",
	})

	assert.NoError(t, err)
	assert.NotNil(t, result)
	assert.Equal(t, "completed", result.Status)
}

func TestOrderServiceGenerateInvoicePDF(t *testing.T) {
	SetupTest(t)

	orderRepo := &mocks.MockOrderRepository{
		FindByIDFunc: func(id uint) (*models.Order, error) {
			return sampleOrder(), nil
		},
	}

	service := services.NewOrderService(orderRepo)
	content, filename, err := service.GenerateInvoicePDF(1, 7, "customer")

	assert.NoError(t, err)
	assert.NotNil(t, content)
	assert.True(t, len(content) > 0)
	assert.Equal(t, "INV-2026-000001.pdf", filename)
}

func TestOrderServiceUpdatePaymentByInvoicePaidMovesOrderToProcessing(t *testing.T) {
	SetupTest(t)

	order := sampleOrder()
	orderRepo := &mocks.MockOrderRepository{
		FindByInvoiceNumberFunc: func(invoiceNumber string) (*models.Order, error) {
			assert.Equal(t, "INV-2026-000001", invoiceNumber)
			return order, nil
		},
		UpdateFunc: func(updated *models.Order) error {
			order.PaymentStatus = updated.PaymentStatus
			order.Status = updated.Status
			return nil
		},
		FindByIDFunc: func(id uint) (*models.Order, error) {
			return order, nil
		},
	}

	service := services.NewOrderService(orderRepo)
	result, err := service.UpdatePaymentByInvoice("INV-2026-000001", "PAID")

	assert.NoError(t, err)
	assert.NotNil(t, result)
	assert.Equal(t, "paid", result.PaymentStatus)
	assert.Equal(t, "processing", result.Status)
}

func TestOrderServiceUpdatePaymentByInvoiceFailedCancelsPendingOrder(t *testing.T) {
	SetupTest(t)

	order := sampleOrder()
	orderRepo := &mocks.MockOrderRepository{
		FindByInvoiceNumberFunc: func(invoiceNumber string) (*models.Order, error) {
			return order, nil
		},
		UpdateFunc: func(updated *models.Order) error {
			order.PaymentStatus = updated.PaymentStatus
			order.Status = updated.Status
			return nil
		},
		FindByIDFunc: func(id uint) (*models.Order, error) {
			return order, nil
		},
	}

	service := services.NewOrderService(orderRepo)
	result, err := service.UpdatePaymentByInvoice("INV-2026-000001", "FAILED")

	assert.NoError(t, err)
	assert.NotNil(t, result)
	assert.Equal(t, "unpaid", result.PaymentStatus)
	assert.Equal(t, "cancelled", result.Status)
}

func TestOrderServiceUpdatePaymentByInvoiceRejectsUnknownStatus(t *testing.T) {
	SetupTest(t)

	orderRepo := &mocks.MockOrderRepository{
		FindByInvoiceNumberFunc: func(invoiceNumber string) (*models.Order, error) {
			return sampleOrder(), nil
		},
	}

	service := services.NewOrderService(orderRepo)
	result, err := service.UpdatePaymentByInvoice("INV-2026-000001", "PENDING")

	assert.ErrorIs(t, err, services.ErrInvalidPaymentStatus)
	assert.Nil(t, result)
}

func sampleOrder() *models.Order {
	return &models.Order{
		Model:           models.Order{}.Model,
		UserID:          7,
		InvoiceNumber:   "INV-2026-000001",
		TotalPrice:      70000,
		Status:          "pending",
		PaymentStatus:   "unpaid",
		ShippingAddress: "Jl. Laut 123",
		User: models.User{
			Model: models.User{}.Model,
			Name:  "John Doe",
		},
		OrderItems: []models.OrderItem{
			{
				Model:     models.OrderItem{}.Model,
				ProductID: 1,
				Quantity:  2,
				Price:     35000,
				Subtotal:  70000,
				Product: models.Product{
					Model: models.Product{}.Model,
					Name:  "Ikan Nila",
				},
			},
		},
	}
}
