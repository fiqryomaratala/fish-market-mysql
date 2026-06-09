package handlers

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/fiqryomaratala/backend/internal/services"
	"github.com/gin-gonic/gin"
)

type CartHandler struct {
	cartService services.CartService
}

type AddToCartRequest struct {
	ProductID uint `json:"product_id"`
	Quantity  int  `json:"quantity"`
}

type UpdateCartRequest struct {
	Quantity int `json:"quantity"`
}

func NewCartHandler(cartService services.CartService) *CartHandler {
	return &CartHandler{cartService: cartService}
}

func (h *CartHandler) Add(c *gin.Context) {
	var req AddToCartRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		ErrorResponse(c, http.StatusBadRequest, "Validation failed")
		return
	}
	if req.ProductID == 0 {
		ErrorResponse(c, http.StatusBadRequest, "Product ID is required")
		return
	}
	if req.Quantity <= 0 {
		ErrorResponse(c, http.StatusBadRequest, "Quantity must be greater than 0")
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
			ErrorResponse(c, http.StatusNotFound, "Product not found")
		case errors.Is(err, services.ErrInsufficientInventory):
			ErrorResponse(c, http.StatusBadRequest, "Inventory is not enough")
		default:
			ErrorResponse(c, http.StatusInternalServerError, "Failed to add product to cart")
		}
		return
	}

	SuccessResponse(c, http.StatusCreated, "Product added to cart", result)
}

func (h *CartHandler) GetAll(c *gin.Context) {
	result, err := h.cartService.GetByUserID(currentUserID(c))
	if err != nil {
		ErrorResponse(c, http.StatusInternalServerError, "Failed to fetch cart")
		return
	}

	SuccessResponse(c, http.StatusOK, "", result)
}

func (h *CartHandler) Update(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil || id <= 0 {
		ErrorResponse(c, http.StatusBadRequest, "Invalid cart ID")
		return
	}

	var req UpdateCartRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		ErrorResponse(c, http.StatusBadRequest, "Validation failed")
		return
	}
	if req.Quantity <= 0 {
		ErrorResponse(c, http.StatusBadRequest, "Quantity must be greater than 0")
		return
	}

	result, err := h.cartService.Update(uint(id), services.UpdateCartInput{
		UserID:   currentUserID(c),
		Quantity: req.Quantity,
	})
	if err != nil {
		switch {
		case errors.Is(err, services.ErrCartItemNotFound):
			ErrorResponse(c, http.StatusNotFound, "Cart item not found")
		case errors.Is(err, services.ErrInsufficientInventory):
			ErrorResponse(c, http.StatusBadRequest, "Inventory is not enough")
		default:
			ErrorResponse(c, http.StatusInternalServerError, "Failed to update cart")
		}
		return
	}

	SuccessResponse(c, http.StatusOK, "Cart updated successfully", result)
}

func (h *CartHandler) Delete(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil || id <= 0 {
		ErrorResponse(c, http.StatusBadRequest, "Invalid cart ID")
		return
	}

	if err := h.cartService.Delete(uint(id), currentUserID(c)); err != nil {
		if errors.Is(err, services.ErrCartItemNotFound) {
			ErrorResponse(c, http.StatusNotFound, "Cart item not found")
			return
		}
		ErrorResponse(c, http.StatusInternalServerError, "Failed to delete cart item")
		return
	}

	SuccessResponse(c, http.StatusOK, "Cart item deleted successfully", nil)
}

func (h *CartHandler) Clear(c *gin.Context) {
	if err := h.cartService.Clear(currentUserID(c)); err != nil {
		ErrorResponse(c, http.StatusInternalServerError, "Failed to clear cart")
		return
	}

	SuccessResponse(c, http.StatusOK, "Cart cleared successfully", nil)
}

func currentUserID(c *gin.Context) uint {
	value, _ := c.Get("user_id")
	userID, _ := value.(uint)
	return userID
}
