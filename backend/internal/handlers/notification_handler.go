package handlers

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/fiqryomaratala/backend/internal/services"
	"github.com/fiqryomaratala/backend/internal/utils"
	"github.com/gin-gonic/gin"
)

type NotificationHandler struct {
	notificationService services.NotificationService
}

func NewNotificationHandler(notificationService services.NotificationService) *NotificationHandler {
	return &NotificationHandler{notificationService: notificationService}
}

// GetAll godoc
// @Summary Get notifications
// @Description Get notifications for the authenticated user
// @Tags Notification
// @Produce json
// @Security BearerAuth
// @Param page query int false "Page number"
// @Param limit query int false "Items per page"
// @Param type query string false "Notification type"
// @Success 200 {object} APIResponse
// @Failure 401 {object} APIResponse
// @Failure 403 {object} APIResponse
// @Failure 500 {object} APIResponse
// @Router /notifications [get]
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
		utils.InternalServerError(c)
		return
	}

	utils.Success(c, "", gin.H{
		"items": items,
		"meta":  meta,
	})
}

// GetUnread godoc
// @Summary Get unread notifications
// @Description Get unread notifications for the authenticated user
// @Tags Notification
// @Produce json
// @Security BearerAuth
// @Success 200 {object} APIResponse
// @Failure 401 {object} APIResponse
// @Failure 403 {object} APIResponse
// @Failure 500 {object} APIResponse
// @Router /notifications/unread [get]
func (h *NotificationHandler) GetUnread(c *gin.Context) {
	items, err := h.notificationService.GetUnread(currentUserID(c))
	if err != nil {
		utils.InternalServerError(c)
		return
	}

	utils.Success(c, "", items)
}

// MarkAsRead godoc
// @Summary Mark notification as read
// @Description Mark a specific notification as read
// @Tags Notification
// @Produce json
// @Security BearerAuth
// @Param id path int true "Notification ID"
// @Success 200 {object} APIResponse
// @Failure 400 {object} APIResponse
// @Failure 401 {object} APIResponse
// @Failure 403 {object} APIResponse
// @Failure 404 {object} APIResponse
// @Failure 500 {object} APIResponse
// @Router /notifications/{id}/read [put]
func (h *NotificationHandler) MarkAsRead(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil || id <= 0 {
		utils.Error(c, http.StatusBadRequest, "Invalid notification ID")
		return
	}

	if err := h.notificationService.MarkAsRead(uint(id), currentUserID(c)); err != nil {
		switch {
		case errors.Is(err, services.ErrNotificationNotFound):
			utils.NotFound(c, "Notification not found")
		case errors.Is(err, services.ErrForbiddenNotificationAccess):
			utils.Forbidden(c)
		default:
			utils.InternalServerError(c)
		}
		return
	}

	utils.Success(c, "Notification marked as read", nil)
}

// MarkAllAsRead godoc
// @Summary Mark all notifications as read
// @Description Mark all notifications for the authenticated user as read
// @Tags Notification
// @Produce json
// @Security BearerAuth
// @Success 200 {object} APIResponse
// @Failure 401 {object} APIResponse
// @Failure 403 {object} APIResponse
// @Failure 500 {object} APIResponse
// @Router /notifications/read-all [put]
func (h *NotificationHandler) MarkAllAsRead(c *gin.Context) {
	if err := h.notificationService.MarkAllAsRead(currentUserID(c)); err != nil {
		utils.InternalServerError(c)
		return
	}

	utils.Success(c, "All notifications marked as read", nil)
}

// Delete godoc
// @Summary Delete notification
// @Description Delete a notification owned by the authenticated user
// @Tags Notification
// @Produce json
// @Security BearerAuth
// @Param id path int true "Notification ID"
// @Success 200 {object} APIResponse
// @Failure 400 {object} APIResponse
// @Failure 401 {object} APIResponse
// @Failure 403 {object} APIResponse
// @Failure 404 {object} APIResponse
// @Failure 500 {object} APIResponse
// @Router /notifications/{id} [delete]
func (h *NotificationHandler) Delete(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil || id <= 0 {
		utils.Error(c, http.StatusBadRequest, "Invalid notification ID")
		return
	}

	if err := h.notificationService.Delete(uint(id), currentUserID(c)); err != nil {
		switch {
		case errors.Is(err, services.ErrNotificationNotFound):
			utils.NotFound(c, "Notification not found")
		case errors.Is(err, services.ErrForbiddenNotificationAccess):
			utils.Forbidden(c)
		default:
			utils.InternalServerError(c)
		}
		return
	}

	utils.Success(c, "Notification deleted successfully", nil)
}
