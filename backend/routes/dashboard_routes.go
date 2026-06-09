package routes

import (
	"gorm.io/gorm"

	"github.com/fiqryomaratala/backend/internal/handlers"
	"github.com/fiqryomaratala/backend/internal/middleware"
	"github.com/fiqryomaratala/backend/internal/repositories"
	"github.com/fiqryomaratala/backend/internal/services"
	"github.com/gin-gonic/gin"
)

func RegisterDashboardRoutes(r *gin.Engine, db *gorm.DB) {
	dashboardRepo := repositories.NewDashboardRepository(db)
	dashboardService := services.NewDashboardService(dashboardRepo)
	dashboardHandler := handlers.NewDashboardHandler(dashboardService)

	api := r.Group("/api")
	dashboard := api.Group("/dashboard")
	dashboard.Use(middleware.AuthMiddleware())
	dashboard.Use(middleware.RoleMiddleware("admin", "staff"))
	{
		dashboard.GET("", dashboardHandler.GetSummary)
		dashboard.GET("/production", dashboardHandler.GetProduction)
		dashboard.GET("/harvest", dashboardHandler.GetHarvest)
		dashboard.GET("/feed", dashboardHandler.GetFeed)
		dashboard.GET("/batch-status", dashboardHandler.GetBatchStatus)
		dashboard.GET("/recent-harvest", dashboardHandler.GetRecentHarvest)
	}
}
