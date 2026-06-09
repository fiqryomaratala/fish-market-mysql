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

// GetAll godoc
// @Summary Get orders
// @Description Get paginated orders for admin or current customer
// @Tags Order
// @Produce json
// @Security BearerAuth
// @Param page query int false "Page number"
// @Param limit query int false "Items per page"
// @Success 200 {object} APIResponse
// @Failure 401 {object} APIResponse
// @Failure 500 {object} APIResponse
// @Router /orders [get]
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

// GetByID godoc
// @Summary Get order detail
// @Description Get order detail by ID
// @Tags Order
// @Produce json
// @Security BearerAuth
// @Param id path int true "Order ID"
// @Success 200 {object} APIResponse
// @Failure 400 {object} APIResponse
// @Failure 401 {object} APIResponse
// @Failure 403 {object} APIResponse
// @Failure 404 {object} APIResponse
// @Failure 500 {object} APIResponse
// @Router /orders/{id} [get]
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

// UpdateStatus godoc
// @Summary Update order status
// @Description Update order lifecycle status
// @Tags Order
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path int true "Order ID"
// @Param request body UpdateOrderStatusRequest true "Order status payload"
// @Success 200 {object} APIResponse
// @Failure 400 {object} APIResponse
// @Failure 401 {object} APIResponse
// @Failure 403 {object} APIResponse
// @Failure 404 {object} APIResponse
// @Failure 500 {object} APIResponse
// @Router /orders/{id}/status [put]
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

// UpdatePayment godoc
// @Summary Update payment status
// @Description Update order payment status
// @Tags Order
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path int true "Order ID"
// @Param request body UpdateOrderPaymentRequest true "Payment status payload"
// @Success 200 {object} APIResponse
// @Failure 400 {object} APIResponse
// @Failure 401 {object} APIResponse
// @Failure 403 {object} APIResponse
// @Failure 404 {object} APIResponse
// @Failure 500 {object} APIResponse
// @Router /orders/{id}/payment [put]
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

// GetInvoice godoc
// @Summary Download order invoice
// @Description Generate and download order invoice PDF
// @Tags Order
// @Produce application/pdf
// @Security BearerAuth
// @Param id path int true "Order ID"
// @Success 200 {file} binary
// @Failure 400 {object} APIResponse
// @Failure 401 {object} APIResponse
// @Failure 403 {object} APIResponse
// @Failure 404 {object} APIResponse
// @Failure 500 {object} APIResponse
// @Router /orders/{id}/invoice [get]
func (h *OrderHandler) GetInvoice(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil || id <= 0 {
		ErrorResponse(c, http.StatusBadRequest, "Invalid order ID")
		return
	}

	content, filename, err := h.orderService.GenerateInvoicePDF(uint(id), currentUserID(c), currentUserRole(c))
	if err != nil {
		switch {
		case errors.Is(err, services.ErrOrderNotFound):
			ErrorResponse(c, http.StatusNotFound, "Order not found")
		case errors.Is(err, services.ErrForbiddenOrderAccess):
			ErrorResponse(c, http.StatusForbidden, "Forbidden")
		default:
			ErrorResponse(c, http.StatusInternalServerError, "Failed to generate invoice")
		}
		return
	}

	c.Header("Content-Description", "File Transfer")
	c.Header("Content-Disposition", "attachment; filename="+filename)
	c.Data(http.StatusOK, "application/pdf", content)
}

func currentUserRole(c *gin.Context) string {
	value, _ := c.Get("role")
	role, _ := value.(string)
	return role
}
