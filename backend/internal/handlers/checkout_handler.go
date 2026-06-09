package handlers

import (
	"errors"
	"io"
	"net/http"

	"github.com/fiqryomaratala/backend/internal/services"
	"github.com/gin-gonic/gin"
)

type CheckoutHandler struct {
	checkoutService services.CheckoutService
}

type CheckoutRequest struct {
	ShippingAddress string `json:"shipping_address"`
}

func NewCheckoutHandler(checkoutService services.CheckoutService) *CheckoutHandler {
	return &CheckoutHandler{checkoutService: checkoutService}
}

func (h *CheckoutHandler) Checkout(c *gin.Context) {
	var req CheckoutRequest
	if c.Request.ContentLength > 0 {
		if err := c.ShouldBindJSON(&req); err != nil && !errors.Is(err, io.EOF) {
			ErrorResponse(c, http.StatusBadRequest, "Validation failed")
			return
		}
	}

	result, err := h.checkoutService.Checkout(services.CheckoutInput{
		UserID:          currentUserID(c),
		ShippingAddress: req.ShippingAddress,
		Audit:           auditContextFromGin(c),
	})
	if err != nil {
		switch {
		case errors.Is(err, services.ErrCartEmpty):
			ErrorResponse(c, http.StatusBadRequest, "Cart is empty")
		case errors.Is(err, services.ErrInsufficientInventory):
			ErrorResponse(c, http.StatusBadRequest, "Inventory is not enough")
		default:
			ErrorResponse(c, http.StatusInternalServerError, "Failed to checkout")
		}
		return
	}

	SuccessResponse(c, http.StatusCreated, "", result)
}
