package routes

import (
	"gorm.io/gorm"

	"github.com/fiqryomaratala/backend/internal/handlers"
	"github.com/fiqryomaratala/backend/internal/middleware"
	"github.com/fiqryomaratala/backend/internal/repositories"
	"github.com/fiqryomaratala/backend/internal/services"
	"github.com/gin-gonic/gin"
)

func RegisterReportRoutes(r *gin.Engine, db *gorm.DB) {
	reportRepo := repositories.NewReportRepository(db)
	reportService := services.NewReportService(reportRepo)
	exportService := services.NewExportService(reportService)
	reportHandler := handlers.NewReportHandler(reportService, exportService)

	api := r.Group("/api")
	reports := api.Group("/reports")
	reports.Use(middleware.AuthMiddleware())
	reports.Use(middleware.RoleMiddleware("admin", "staff"))
	{
		reports.GET("/harvest", reportHandler.GetHarvestReport)
		reports.GET("/production", reportHandler.GetProductionReport)
		reports.GET("/feeding", reportHandler.GetFeedingReport)
		reports.GET("/export/excel", reportHandler.ExportExcel)
		reports.GET("/export/pdf", reportHandler.ExportPDF)
	}
}
