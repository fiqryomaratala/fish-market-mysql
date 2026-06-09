package handlers

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/fiqryomaratala/backend/internal/services"
	"github.com/gin-gonic/gin"
)

type NotificationHandler struct {
	notificationService services.NotificationService
}

func NewNotificationHandler(notificationService services.NotificationService) *NotificationHandler {
	return &NotificationHandler{notificationService: notificationService}
}

func (h *NotificationHandler) GetAll(c *gin.Context) {
	page := parsePositiveInt(c.DefaultQuery("page", "1"), 1)
	limit := parsePositiveInt(c.DefaultQuery("limit", "10"), 10)

	items, meta, err := h.notificationService.GetAll(services.NotificationListParams{
		UserID: currentUserID(c),
		Page:   page,
		Limit:  limit,
		Type:   c.Query("type"),
	})
	if err != nil {
		ErrorResponse(c, http.StatusInternalServerError, "Failed to fetch notifications")
		return
	}

	SuccessResponse(c, http.StatusOK, "", gin.H{
		"items": items,
		"meta":  meta,
	})
}

func (h *NotificationHandler) GetUnread(c *gin.Context) {
	items, err := h.notificationService.GetUnread(currentUserID(c))
	if err != nil {
		ErrorResponse(c, http.StatusInternalServerError, "Failed to fetch unread notifications")
		return
	}

	SuccessResponse(c, http.StatusOK, "", items)
}

func (h *NotificationHandler) MarkAsRead(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil || id <= 0 {
		ErrorResponse(c, http.StatusBadRequest, "Invalid notification ID")
		return
	}

	if err := h.notificationService.MarkAsRead(uint(id), currentUserID(c)); err != nil {
		switch {
		case errors.Is(err, services.ErrNotificationNotFound):
			ErrorResponse(c, http.StatusNotFound, "Notification not found")
		case errors.Is(err, services.ErrForbiddenNotificationAccess):
			ErrorResponse(c, http.StatusForbidden, "Forbidden")
		default:
			ErrorResponse(c, http.StatusInternalServerError, "Failed to mark notification as read")
		}
		return
	}

	SuccessResponse(c, http.StatusOK, "Notification marked as read", nil)
}

func (h *NotificationHandler) MarkAllAsRead(c *gin.Context) {
	if err := h.notificationService.MarkAllAsRead(currentUserID(c)); err != nil {
		ErrorResponse(c, http.StatusInternalServerError, "Failed to mark all notifications as read")
		return
	}

	SuccessResponse(c, http.StatusOK, "All notifications marked as read", nil)
}

func (h *NotificationHandler) Delete(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil || id <= 0 {
		ErrorResponse(c, http.StatusBadRequest, "Invalid notification ID")
		return
	}

	if err := h.notificationService.Delete(uint(id), currentUserID(c)); err != nil {
		switch {
		case errors.Is(err, services.ErrNotificationNotFound):
			ErrorResponse(c, http.StatusNotFound, "Notification not found")
		case errors.Is(err, services.ErrForbiddenNotificationAccess):
			ErrorResponse(c, http.StatusForbidden, "Forbidden")
		default:
			ErrorResponse(c, http.StatusInternalServerError, "Failed to delete notification")
		}
		return
	}

	SuccessResponse(c, http.StatusOK, "Notification deleted successfully", nil)
}
