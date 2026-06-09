package handlers

import (
	"errors"
	"io"
	"net/http"

	"github.com/fiqryomaratala/backend/internal/services"
	"github.com/fiqryomaratala/backend/internal/utils"
	appvalidator "github.com/fiqryomaratala/backend/internal/validator"
	"github.com/gin-gonic/gin"
)

type CheckoutHandler struct {
	checkoutService services.CheckoutService
}

type CheckoutRequest struct {
	ShippingAddress string `json:"shipping_address" validate:"max=255"`
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
			utils.ValidationError(c, appvalidator.FieldError("error", "invalid request body"))
			return
		}
		if err := appvalidator.ValidateStruct(req); err != nil {
			utils.ValidationError(c, appvalidator.FormatValidationErrors(err))
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
			utils.Error(c, http.StatusBadRequest, "Cart is empty")
		case errors.Is(err, services.ErrInsufficientInventory):
			utils.Error(c, http.StatusBadRequest, "Inventory is not enough")
		default:
			utils.InternalServerError(c)
		}
		return
	}

	utils.Created(c, "", result)
}
