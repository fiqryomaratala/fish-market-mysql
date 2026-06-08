package routes

import (
	"gorm.io/gorm"

	"github.com/fiqryomaratala/backend/internal/handlers"
	"github.com/fiqryomaratala/backend/internal/middleware"
	"github.com/fiqryomaratala/backend/internal/repositories"
	"github.com/fiqryomaratala/backend/internal/services"
	"github.com/gin-gonic/gin"
)

func RegisterFeedingLogRoutes(r *gin.Engine, db *gorm.DB) {
	batchRepo := repositories.NewFishBatchRepository(db)
	logRepo := repositories.NewFeedingLogRepository(db)
	logService := services.NewFeedingLogService(logRepo, batchRepo)
	logHandler := handlers.NewFeedingLogHandler(logService)

	api := r.Group("/api")
	logs := api.Group("/feeding-logs")
	logs.Use(middleware.AuthMiddleware())
	logs.Use(middleware.RoleMiddleware("admin", "staff"))
	{
		logs.POST("", logHandler.Create)
		logs.GET("", logHandler.GetAll)
		logs.GET("/:id", logHandler.GetByID)
		logs.PUT("/:id", logHandler.Update)
		logs.DELETE("/:id", middleware.RoleMiddleware("admin"), logHandler.Delete)
	}
}
