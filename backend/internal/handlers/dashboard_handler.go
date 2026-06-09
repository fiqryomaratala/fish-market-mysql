package handlers

import (
	"net/http"

	"github.com/fiqryomaratala/backend/internal/services"
	"github.com/gin-gonic/gin"
)

type DashboardHandler struct {
	dashboardService services.DashboardService
}

func NewDashboardHandler(dashboardService services.DashboardService) *DashboardHandler {
	return &DashboardHandler{dashboardService: dashboardService}
}

func (h *DashboardHandler) GetSummary(c *gin.Context) {
	data, err := h.dashboardService.GetSummary()
	if err != nil {
		ErrorResponse(c, http.StatusInternalServerError, "Failed to fetch dashboard summary")
		return
	}

	SuccessResponse(c, http.StatusOK, "", data)
}

func (h *DashboardHandler) GetProduction(c *gin.Context) {
	data, err := h.dashboardService.GetProduction()
	if err != nil {
		ErrorResponse(c, http.StatusInternalServerError, "Failed to fetch dashboard production")
		return
	}

	SuccessResponse(c, http.StatusOK, "", data)
}

func (h *DashboardHandler) GetHarvest(c *gin.Context) {
	data, err := h.dashboardService.GetHarvestAnalytics()
	if err != nil {
		ErrorResponse(c, http.StatusInternalServerError, "Failed to fetch dashboard harvest analytics")
		return
	}

	SuccessResponse(c, http.StatusOK, "", data)
}

func (h *DashboardHandler) GetFeed(c *gin.Context) {
	data, err := h.dashboardService.GetFeedAnalytics()
	if err != nil {
		ErrorResponse(c, http.StatusInternalServerError, "Failed to fetch dashboard feed analytics")
		return
	}

	SuccessResponse(c, http.StatusOK, "", data)
}

func (h *DashboardHandler) GetBatchStatus(c *gin.Context) {
	data, err := h.dashboardService.GetBatchStatus()
	if err != nil {
		ErrorResponse(c, http.StatusInternalServerError, "Failed to fetch dashboard batch status")
		return
	}

	SuccessResponse(c, http.StatusOK, "", data)
}

func (h *DashboardHandler) GetRecentHarvest(c *gin.Context) {
	data, err := h.dashboardService.GetRecentHarvests()
	if err != nil {
		ErrorResponse(c, http.StatusInternalServerError, "Failed to fetch recent harvests")
		return
	}

	SuccessResponse(c, http.StatusOK, "", data)
}
