package handlers

import (
	"errors"
	"io"
	"net/http"

	"github.com/fiqryomaratala/backend/internal/services"
	"github.com/fiqryomaratala/backend/internal/utils"
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

// Checkout godoc
// @Summary Checkout cart
// @Description Create an order from the authenticated customer's cart
// @Tags Checkout
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param request body CheckoutRequest false "Checkout payload"
// @Success 201 {object} APIResponse
// @Failure 400 {object} APIResponse
// @Failure 401 {object} APIResponse
// @Failure 403 {object} APIResponse
// @Failure 500 {object} APIResponse
// @Router /checkout [post]
func (h *CheckoutHandler) Checkout(c *gin.Context) {
	var req CheckoutRequest
	if c.Request.ContentLength > 0 {
		if err := c.ShouldBindJSON(&req); err != nil && !errors.Is(err, io.EOF) {
			utils.ErrorResponse(c, http.StatusBadRequest, "Validation failed")
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
			utils.ErrorResponse(c, http.StatusBadRequest, "Cart is empty")
		case errors.Is(err, services.ErrInsufficientInventory):
			utils.ErrorResponse(c, http.StatusBadRequest, "Inventory is not enough")
		default:
			utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to checkout")
		}
		return
	}

	utils.SuccessResponse(c, http.StatusCreated, "", result)
}
