package tests

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/fiqryomaratala/backend/config"
	"github.com/fiqryomaratala/backend/internal/handlers"
	"github.com/fiqryomaratala/backend/internal/mocks"
	"github.com/fiqryomaratala/backend/internal/models"
	"github.com/fiqryomaratala/backend/internal/services"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestPaymentWebhookEndpointSuccess(t *testing.T) {
	SetupTest(t)
	gin.SetMode(gin.TestMode)

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

	recorder := performWebhookRequest(t, setupPaymentWebhookRouter(orderRepo, "secret-token"), map[string]interface{}{
		"external_id": "INV-2026-000001",
		"status":      "paid",
		"paid_at":     "2026-07-01T10:00:00Z",
	}, "secret-token")

	require.Equal(t, http.StatusOK, recorder.Code)
	assert.Contains(t, recorder.Body.String(), `"message":"Webhook processed"`)
	assert.Contains(t, recorder.Body.String(), `"invoice":"INV-2026-000001"`)
	assert.Contains(t, recorder.Body.String(), `"status":"PAID"`)
	assert.Equal(t, "paid", order.PaymentStatus)
	assert.Equal(t, "processing", order.Status)
}

func TestPaymentWebhookEndpointRejectsInvalidToken(t *testing.T) {
	SetupTest(t)
	gin.SetMode(gin.TestMode)

	recorder := performWebhookRequest(t, setupPaymentWebhookRouter(&mocks.MockOrderRepository{}, "secret-token"), map[string]interface{}{
		"external_id": "INV-2026-000001",
		"status":      "paid",
	}, "wrong-token")

	require.Equal(t, http.StatusUnauthorized, recorder.Code)
	assert.Contains(t, recorder.Body.String(), `"message":"Unauthorized webhook"`)
}

func TestPaymentWebhookEndpointRejectsInvalidPayload(t *testing.T) {
	SetupTest(t)
	gin.SetMode(gin.TestMode)

	recorder := performWebhookRequest(t, setupPaymentWebhookRouter(&mocks.MockOrderRepository{}, "secret-token"), map[string]interface{}{
		"status": "paid",
	}, "secret-token")

	require.Equal(t, http.StatusBadRequest, recorder.Code)
	assert.Contains(t, recorder.Body.String(), `"message":"Invalid webhook payload"`)
}

func TestPaymentWebhookEndpointReturnsNotFoundForUnknownInvoice(t *testing.T) {
	SetupTest(t)
	gin.SetMode(gin.TestMode)

	orderRepo := &mocks.MockOrderRepository{
		FindByInvoiceNumberFunc: func(invoiceNumber string) (*models.Order, error) {
			return nil, nil
		},
	}

	recorder := performWebhookRequest(t, setupPaymentWebhookRouter(orderRepo, "secret-token"), map[string]interface{}{
		"external_id": "INV-2026-999999",
		"status":      "paid",
	}, "secret-token")

	require.Equal(t, http.StatusNotFound, recorder.Code)
	assert.Contains(t, recorder.Body.String(), `"message":"Order not found"`)
}

func TestPaymentWebhookEndpointReturnsServiceUnavailableWhenTokenNotConfigured(t *testing.T) {
	SetupTest(t)
	gin.SetMode(gin.TestMode)

	recorder := performWebhookRequest(t, setupPaymentWebhookRouter(&mocks.MockOrderRepository{}, ""), map[string]interface{}{
		"external_id": "INV-2026-000001",
		"status":      "paid",
	}, "secret-token")

	require.Equal(t, http.StatusServiceUnavailable, recorder.Code)
	assert.Contains(t, recorder.Body.String(), `"message":"Payment gateway is not configured"`)
}

func setupPaymentWebhookRouter(orderRepo *mocks.MockOrderRepository, webhookToken string) *gin.Engine {
	orderService := services.NewOrderService(orderRepo)
	paymentGateway := services.NewXenditPaymentService(&config.Config{
		XenditWebhookToken: webhookToken,
	})
	paymentHandler := handlers.NewPaymentHandler(orderService, paymentGateway)

	router := gin.New()
	router.POST("/api/payments/xendit/webhook", paymentHandler.HandleXenditWebhook)

	return router
}

func performWebhookRequest(
	t *testing.T,
	router *gin.Engine,
	body map[string]interface{},
	callbackToken string,
) *httptest.ResponseRecorder {
	t.Helper()

	payload, err := json.Marshal(body)
	require.NoError(t, err)

	request := httptest.NewRequest(http.MethodPost, "/api/payments/xendit/webhook", bytes.NewReader(payload))
	request.Header.Set("Content-Type", "application/json")
	if callbackToken != "" {
		request.Header.Set("x-callback-token", callbackToken)
	}

	recorder := httptest.NewRecorder()
	router.ServeHTTP(recorder, request)

	return recorder
}
