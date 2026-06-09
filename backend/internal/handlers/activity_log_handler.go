package handlers

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/fiqryomaratala/backend/internal/services"
	"github.com/gin-gonic/gin"
)

type ActivityLogHandler struct {
	activityLogService services.ActivityLogService
}

func NewActivityLogHandler(activityLogService services.ActivityLogService) *ActivityLogHandler {
	return &ActivityLogHandler{activityLogService: activityLogService}
}

// GetAll godoc
// @Summary Get activity logs
// @Description Get paginated activity logs with optional filters
// @Tags Activity Log
// @Produce json
// @Security BearerAuth
// @Param page query int false "Page number"
// @Param limit query int false "Items per page"
// @Param module query string false "Module filter"
// @Param action query string false "Action filter"
// @Param user_id query int false "User ID filter"
// @Success 200 {object} APIResponse
// @Failure 401 {object} APIResponse
// @Failure 403 {object} APIResponse
// @Failure 500 {object} APIResponse
// @Router /activity-logs [get]
func (h *ActivityLogHandler) GetAll(c *gin.Context) {
	page := parsePositiveInt(c.DefaultQuery("page", "1"), 1)
	limit := parsePositiveInt(c.DefaultQuery("limit", "10"), 10)

	result, err := h.activityLogService.GetAll(services.ActivityLogListParams{
		Page:   page,
		Limit:  limit,
		Module: c.Query("module"),
		Action: c.Query("action"),
		UserID: parseUintQuery(c.Query("user_id")),
	})
	if err != nil {
		ErrorResponse(c, http.StatusInternalServerError, "Failed to fetch activity logs")
		return
	}

	SuccessResponse(c, http.StatusOK, "", gin.H{
		"items": result.Items,
		"meta":  result.Meta,
	})
}

// GetByID godoc
// @Summary Get activity log detail
// @Description Get activity log detail by ID
// @Tags Activity Log
// @Produce json
// @Security BearerAuth
// @Param id path int true "Activity log ID"
// @Success 200 {object} APIResponse
// @Failure 400 {object} APIResponse
// @Failure 401 {object} APIResponse
// @Failure 403 {object} APIResponse
// @Failure 404 {object} APIResponse
// @Failure 500 {object} APIResponse
// @Router /activity-logs/{id} [get]
func (h *ActivityLogHandler) GetByID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil || id <= 0 {
		ErrorResponse(c, http.StatusBadRequest, "Invalid activity log ID")
		return
	}

	result, err := h.activityLogService.GetByID(uint(id))
	if err != nil {
		if errors.Is(err, services.ErrActivityLogNotFound) {
			ErrorResponse(c, http.StatusNotFound, "Activity log not found")
			return
		}

		ErrorResponse(c, http.StatusInternalServerError, "Failed to fetch activity log")
		return
	}

	SuccessResponse(c, http.StatusOK, "", result)
}
