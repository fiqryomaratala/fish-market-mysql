package handlers

import (
	"github.com/fiqryomaratala/backend/internal/services"
	"github.com/fiqryomaratala/backend/internal/utils"
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
		utils.InternalServerError(c)
		return
	}

	utils.Success(c, "", data)
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
		utils.InternalServerError(c)
		return
	}

	utils.Success(c, "", data)
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
		utils.InternalServerError(c)
		return
	}

	utils.Success(c, "", data)
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
		utils.InternalServerError(c)
		return
	}

	utils.Success(c, "", data)
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
		utils.InternalServerError(c)
		return
	}

	utils.Success(c, "", data)
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
		utils.InternalServerError(c)
		return
	}

	utils.Success(c, "", data)
}
