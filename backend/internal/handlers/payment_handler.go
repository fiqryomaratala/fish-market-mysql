package handlers

import (
	"errors"
	"net/http"

	"github.com/fiqryomaratala/backend/internal/services"
	"github.com/fiqryomaratala/backend/internal/utils"
	"github.com/gin-gonic/gin"
)

type PaymentHandler struct {
	orderService   services.OrderService
	paymentGateway services.PaymentGatewayService
}

func NewPaymentHandler(orderService services.OrderService, paymentGateway services.PaymentGatewayService) *PaymentHandler {
	return &PaymentHandler{
		orderService:   orderService,
		paymentGateway: paymentGateway,
	}
}

func (h *PaymentHandler) HandleXenditWebhook(c *gin.Context) {
	payload, err := h.paymentGateway.ParseWebhook(c.Request)
	if err != nil {
		switch {
		case errors.Is(err, services.ErrPaymentWebhookUnauthorized):
			utils.Error(c, http.StatusUnauthorized, "Unauthorized webhook")
		case errors.Is(err, services.ErrPaymentGatewayNotConfigured):
			utils.Error(c, http.StatusServiceUnavailable, "Payment gateway is not configured")
		default:
			utils.Error(c, http.StatusBadRequest, "Invalid webhook payload")
		}
		return
	}

	_, err = h.orderService.UpdatePaymentByInvoice(payload.ExternalID, payload.Status)
	if err != nil {
		switch {
		case errors.Is(err, services.ErrOrderNotFound):
			utils.NotFound(c, "Order not found")
		default:
			utils.InternalServerError(c)
		}
		return
	}

	utils.Success(c, "Webhook processed", gin.H{"invoice": payload.ExternalID, "status": payload.Status})
}
