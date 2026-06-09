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

// GetSummary godoc
// @Summary Get dashboard summary
// @Description Get overall dashboard summary statistics
// @Tags Dashboard
// @Produce json
// @Security BearerAuth
// @Success 200 {object} APIResponse
// @Failure 401 {object} APIResponse
// @Failure 403 {object} APIResponse
// @Failure 500 {object} APIResponse
// @Router /dashboard [get]
func (h *DashboardHandler) GetSummary(c *gin.Context) {
	data, err := h.dashboardService.GetSummary()
	if err != nil {
		ErrorResponse(c, http.StatusInternalServerError, "Failed to fetch dashboard summary")
		return
	}

	SuccessResponse(c, http.StatusOK, "", data)
}

// GetProduction godoc
// @Summary Get production analytics
// @Description Get production analytics grouped by pond
// @Tags Dashboard
// @Produce json
// @Security BearerAuth
// @Success 200 {object} APIResponse
// @Failure 401 {object} APIResponse
// @Failure 403 {object} APIResponse
// @Failure 500 {object} APIResponse
// @Router /dashboard/production [get]
func (h *DashboardHandler) GetProduction(c *gin.Context) {
	data, err := h.dashboardService.GetProduction()
	if err != nil {
		ErrorResponse(c, http.StatusInternalServerError, "Failed to fetch dashboard production")
		return
	}

	SuccessResponse(c, http.StatusOK, "", data)
}

// GetHarvest godoc
// @Summary Get harvest analytics
// @Description Get harvest analytics grouped by month
// @Tags Dashboard
// @Produce json
// @Security BearerAuth
// @Success 200 {object} APIResponse
// @Failure 401 {object} APIResponse
// @Failure 403 {object} APIResponse
// @Failure 500 {object} APIResponse
// @Router /dashboard/harvest [get]
func (h *DashboardHandler) GetHarvest(c *gin.Context) {
	data, err := h.dashboardService.GetHarvestAnalytics()
	if err != nil {
		ErrorResponse(c, http.StatusInternalServerError, "Failed to fetch dashboard harvest analytics")
		return
	}

	SuccessResponse(c, http.StatusOK, "", data)
}

// GetFeed godoc
// @Summary Get feed analytics
// @Description Get total feed usage per fish batch
// @Tags Dashboard
// @Produce json
// @Security BearerAuth
// @Success 200 {object} APIResponse
// @Failure 401 {object} APIResponse
// @Failure 403 {object} APIResponse
// @Failure 500 {object} APIResponse
// @Router /dashboard/feed [get]
func (h *DashboardHandler) GetFeed(c *gin.Context) {
	data, err := h.dashboardService.GetFeedAnalytics()
	if err != nil {
		ErrorResponse(c, http.StatusInternalServerError, "Failed to fetch dashboard feed analytics")
		return
	}

	SuccessResponse(c, http.StatusOK, "", data)
}

// GetBatchStatus godoc
// @Summary Get batch status analytics
// @Description Get fish batch counts grouped by status
// @Tags Dashboard
// @Produce json
// @Security BearerAuth
// @Success 200 {object} APIResponse
// @Failure 401 {object} APIResponse
// @Failure 403 {object} APIResponse
// @Failure 500 {object} APIResponse
// @Router /dashboard/batch-status [get]
func (h *DashboardHandler) GetBatchStatus(c *gin.Context) {
	data, err := h.dashboardService.GetBatchStatus()
	if err != nil {
		ErrorResponse(c, http.StatusInternalServerError, "Failed to fetch dashboard batch status")
		return
	}

	SuccessResponse(c, http.StatusOK, "", data)
}

// GetRecentHarvest godoc
// @Summary Get recent harvests
// @Description Get the 10 most recent harvest records
// @Tags Dashboard
// @Produce json
// @Security BearerAuth
// @Success 200 {object} APIResponse
// @Failure 401 {object} APIResponse
// @Failure 403 {object} APIResponse
// @Failure 500 {object} APIResponse
// @Router /dashboard/recent-harvest [get]
func (h *DashboardHandler) GetRecentHarvest(c *gin.Context) {
	data, err := h.dashboardService.GetRecentHarvests()
	if err != nil {
		ErrorResponse(c, http.StatusInternalServerError, "Failed to fetch recent harvests")
		return
	}

	SuccessResponse(c, http.StatusOK, "", data)
}
