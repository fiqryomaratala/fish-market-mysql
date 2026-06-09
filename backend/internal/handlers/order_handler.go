package handlers

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/fiqryomaratala/backend/internal/services"
	"github.com/gin-gonic/gin"
)

type OrderHandler struct {
	orderService services.OrderService
}

type UpdateOrderStatusRequest struct {
	Status string `json:"status"`
}

type UpdateOrderPaymentRequest struct {
	PaymentStatus string `json:"payment_status"`
}

func NewOrderHandler(orderService services.OrderService) *OrderHandler {
	return &OrderHandler{orderService: orderService}
}

func (h *OrderHandler) GetAll(c *gin.Context) {
	page := parsePositiveInt(c.DefaultQuery("page", "1"), 1)
	limit := parsePositiveInt(c.DefaultQuery("limit", "10"), 10)

	items, meta, err := h.orderService.GetAll(services.OrderListParams{
		Page:   page,
		Limit:  limit,
		UserID: currentUserID(c),
		Role:   currentUserRole(c),
	})
	if err != nil {
		ErrorResponse(c, http.StatusInternalServerError, "Failed to fetch orders")
		return
	}

	SuccessResponse(c, http.StatusOK, "", gin.H{
		"items": items,
		"meta":  meta,
	})
}

func (h *OrderHandler) GetByID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil || id <= 0 {
		ErrorResponse(c, http.StatusBadRequest, "Invalid order ID")
		return
	}

	item, err := h.orderService.GetByID(uint(id), currentUserID(c), currentUserRole(c))
	if err != nil {
		switch {
		case errors.Is(err, services.ErrOrderNotFound):
			ErrorResponse(c, http.StatusNotFound, "Order not found")
		case errors.Is(err, services.ErrForbiddenOrderAccess):
			ErrorResponse(c, http.StatusForbidden, "Forbidden")
		default:
			ErrorResponse(c, http.StatusInternalServerError, "Failed to fetch order")
		}
		return
	}

	SuccessResponse(c, http.StatusOK, "", item)
}

func (h *OrderHandler) UpdateStatus(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil || id <= 0 {
		ErrorResponse(c, http.StatusBadRequest, "Invalid order ID")
		return
	}

	var req UpdateOrderStatusRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		ErrorResponse(c, http.StatusBadRequest, "Validation failed")
		return
	}

	item, err := h.orderService.UpdateStatus(uint(id), services.UpdateOrderStatusInput{
		Status: req.Status,
		Audit:  auditContextFromGin(c),
	})
	if err != nil {
		switch {
		case errors.Is(err, services.ErrOrderNotFound):
			ErrorResponse(c, http.StatusNotFound, "Order not found")
		case errors.Is(err, services.ErrInvalidOrderStatus):
			ErrorResponse(c, http.StatusBadRequest, "Invalid order status")
		default:
			ErrorResponse(c, http.StatusInternalServerError, "Failed to update order status")
		}
		return
	}

	SuccessResponse(c, http.StatusOK, "Order status updated successfully", item)
}

func (h *OrderHandler) UpdatePayment(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil || id <= 0 {
		ErrorResponse(c, http.StatusBadRequest, "Invalid order ID")
		return
	}

	var req UpdateOrderPaymentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		ErrorResponse(c, http.StatusBadRequest, "Validation failed")
		return
	}

	item, err := h.orderService.UpdatePayment(uint(id), services.UpdateOrderPaymentInput{
		PaymentStatus: req.PaymentStatus,
		Audit:         auditContextFromGin(c),
	})
	if err != nil {
		switch {
		case errors.Is(err, services.ErrOrderNotFound):
			ErrorResponse(c, http.StatusNotFound, "Order not found")
		case errors.Is(err, services.ErrInvalidPaymentStatus):
			ErrorResponse(c, http.StatusBadRequest, "Invalid payment status")
		default:
			ErrorResponse(c, http.StatusInternalServerError, "Failed to update payment status")
		}
		return
	}

	SuccessResponse(c, http.StatusOK, "Order payment updated successfully", item)
}

func currentUserRole(c *gin.Context) string {
	value, _ := c.Get("role")
	role, _ := value.(string)
	return role
}
