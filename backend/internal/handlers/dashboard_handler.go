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

func (h *DashboardHandler) GetSummary(c *gin.Context) {
	data, err := h.dashboardService.GetSummary()
	if err != nil {
		utils.InternalServerError(c)
		return
	}

	utils.Success(c, "", data)
}

func (h *DashboardHandler) GetSales(c *gin.Context) {
	data, err := h.dashboardService.GetSales()
	if err != nil {
		utils.InternalServerError(c)
		return
	}

	utils.Success(c, "", data)
}

func (h *DashboardHandler) GetHarvest(c *gin.Context) {
	data, err := h.dashboardService.GetHarvest()
	if err != nil {
		utils.InternalServerError(c)
		return
	}

	utils.Success(c, "", data)
}

func (h *DashboardHandler) GetLatestOrders(c *gin.Context) {
	data, err := h.dashboardService.GetLatestOrders()
	if err != nil {
		utils.InternalServerError(c)
		return
	}

	utils.Success(c, "", data)
}

func (h *DashboardHandler) GetInventoryAlerts(c *gin.Context) {
	data, err := h.dashboardService.GetInventoryAlerts()
	if err != nil {
		utils.InternalServerError(c)
		return
	}

	utils.Success(c, "", data)
}

func (h *DashboardHandler) GetRecentActivity(c *gin.Context) {
	data, err := h.dashboardService.GetRecentActivity()
	if err != nil {
		utils.InternalServerError(c)
		return
	}

	utils.Success(c, "", data)
}

func (h *DashboardHandler) GetProduction(c *gin.Context) {
	data, err := h.dashboardService.GetProduction()
	if err != nil {
		utils.InternalServerError(c)
		return
	}

	utils.Success(c, "", data)
}

func (h *DashboardHandler) GetFeed(c *gin.Context) {
	data, err := h.dashboardService.GetFeedAnalytics()
	if err != nil {
		utils.InternalServerError(c)
		return
	}

	utils.Success(c, "", data)
}

func (h *DashboardHandler) GetBatchStatus(c *gin.Context) {
	data, err := h.dashboardService.GetBatchStatus()
	if err != nil {
		utils.InternalServerError(c)
		return
	}

	utils.Success(c, "", data)
}

func (h *DashboardHandler) GetRecentHarvest(c *gin.Context) {
	data, err := h.dashboardService.GetRecentHarvests()
	if err != nil {
		utils.InternalServerError(c)
		return
	}

	utils.Success(c, "", data)
}
