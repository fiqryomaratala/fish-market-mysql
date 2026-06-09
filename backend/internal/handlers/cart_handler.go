package handlers

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/fiqryomaratala/backend/internal/services"
	"github.com/fiqryomaratala/backend/internal/utils"
	appvalidator "github.com/fiqryomaratala/backend/internal/validator"
	"github.com/gin-gonic/gin"
)

type CartHandler struct {
	cartService services.CartService
}

type AddToCartRequest struct {
	ProductID uint `json:"product_id" validate:"required"`
	Quantity  int  `json:"quantity" validate:"gt=0"`
}

type UpdateCartRequest struct {
	Quantity int `json:"quantity" validate:"gt=0"`
}

func NewCartHandler(cartService services.CartService) *CartHandler {
	return &CartHandler{cartService: cartService}
}

// Add godoc
// @Summary Add product to cart
// @Description Add a product to the authenticated customer's cart
// @Tags Cart
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param request body AddToCartRequest true "Cart payload"
// @Success 201 {object} APIResponse
// @Failure 400 {object} APIResponse
// @Failure 401 {object} APIResponse
// @Failure 403 {object} APIResponse
// @Failure 404 {object} APIResponse
// @Failure 500 {object} APIResponse
// @Router /cart [post]
func (h *CartHandler) Add(c *gin.Context) {
	var req AddToCartRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ValidationError(c, appvalidator.FieldError("error", "invalid request body"))
		return
	}
	if err := appvalidator.ValidateStruct(req); err != nil {
		utils.ValidationError(c, appvalidator.FormatValidationErrors(err))
		return
	}

	userID := currentUserID(c)
	result, err := h.cartService.Add(services.AddToCartInput{
		UserID:    userID,
		ProductID: req.ProductID,
		Quantity:  req.Quantity,
	})
	if err != nil {
		switch {
		case errors.Is(err, services.ErrProductNotFound):
			utils.NotFound(c, "Product not found")
		case errors.Is(err, services.ErrInsufficientInventory):
			utils.Error(c, http.StatusBadRequest, "Inventory is not enough")
		default:
			utils.InternalServerError(c)
		}
		return
	}

	utils.Created(c, "Product added to cart", result)
}

// GetAll godoc
// @Summary Get cart items
// @Description Get all cart items for the authenticated customer
// @Tags Cart
// @Produce json
// @Security BearerAuth
// @Success 200 {object} APIResponse
// @Failure 401 {object} APIResponse
// @Failure 403 {object} APIResponse
// @Failure 500 {object} APIResponse
// @Router /cart [get]
func (h *CartHandler) GetAll(c *gin.Context) {
	result, err := h.cartService.GetByUserID(currentUserID(c))
	if err != nil {
		utils.InternalServerError(c)
		return
	}

	utils.Success(c, "", result)
}

// Update godoc
// @Summary Update cart item
// @Description Update quantity of a cart item
// @Tags Cart
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path int true "Cart item ID"
// @Param request body UpdateCartRequest true "Cart update payload"
// @Success 200 {object} APIResponse
// @Failure 400 {object} APIResponse
// @Failure 401 {object} APIResponse
// @Failure 403 {object} APIResponse
// @Failure 404 {object} APIResponse
// @Failure 500 {object} APIResponse
// @Router /cart/{id} [put]
func (h *CartHandler) Update(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil || id <= 0 {
		utils.Error(c, http.StatusBadRequest, "Invalid cart ID")
		return
	}

	var req UpdateCartRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ValidationError(c, appvalidator.FieldError("error", "invalid request body"))
		return
	}
	if err := appvalidator.ValidateStruct(req); err != nil {
		utils.ValidationError(c, appvalidator.FormatValidationErrors(err))
		return
	}

	result, err := h.cartService.Update(uint(id), services.UpdateCartInput{
		UserID:   currentUserID(c),
		Quantity: req.Quantity,
	})
	if err != nil {
		switch {
		case errors.Is(err, services.ErrCartItemNotFound):
			utils.NotFound(c, "Cart item not found")
		case errors.Is(err, services.ErrInsufficientInventory):
			utils.Error(c, http.StatusBadRequest, "Inventory is not enough")
		default:
			utils.InternalServerError(c)
		}
		return
	}

	utils.Success(c, "Cart updated successfully", result)
}

// Delete godoc
// @Summary Delete cart item
// @Description Remove a cart item by ID
// @Tags Cart
// @Produce json
// @Security BearerAuth
// @Param id path int true "Cart item ID"
// @Success 200 {object} APIResponse
// @Failure 400 {object} APIResponse
// @Failure 401 {object} APIResponse
// @Failure 403 {object} APIResponse
// @Failure 404 {object} APIResponse
// @Failure 500 {object} APIResponse
// @Router /cart/{id} [delete]
func (h *CartHandler) Delete(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil || id <= 0 {
		utils.Error(c, http.StatusBadRequest, "Invalid cart ID")
		return
	}

	if err := h.cartService.Delete(uint(id), currentUserID(c)); err != nil {
		if errors.Is(err, services.ErrCartItemNotFound) {
			utils.NotFound(c, "Cart item not found")
			return
		}
		utils.InternalServerError(c)
		return
	}

	utils.Success(c, "Cart item deleted successfully", nil)
}

// Clear godoc
// @Summary Clear cart
// @Description Remove all items from the authenticated customer's cart
// @Tags Cart
// @Produce json
// @Security BearerAuth
// @Success 200 {object} APIResponse
// @Failure 401 {object} APIResponse
// @Failure 403 {object} APIResponse
// @Failure 500 {object} APIResponse
// @Router /cart [delete]
func (h *CartHandler) Clear(c *gin.Context) {
	if err := h.cartService.Clear(currentUserID(c)); err != nil {
		utils.InternalServerError(c)
		return
	}

	utils.Success(c, "Cart cleared successfully", nil)
}

func currentUserID(c *gin.Context) uint {
	value, _ := c.Get("user_id")
	userID, _ := value.(uint)
	return userID
}
