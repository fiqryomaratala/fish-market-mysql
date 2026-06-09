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
