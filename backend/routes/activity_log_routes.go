package routes

import (
	"gorm.io/gorm"

	"github.com/fiqryomaratala/backend/internal/handlers"
	"github.com/fiqryomaratala/backend/internal/middleware"
	"github.com/fiqryomaratala/backend/internal/repositories"
	"github.com/fiqryomaratala/backend/internal/services"
	"github.com/gin-gonic/gin"
)

func RegisterActivityLogRoutes(r *gin.Engine, db *gorm.DB) {
	activityLogRepo := repositories.NewActivityLogRepository(db)
	activityLogService := services.NewActivityLogService(activityLogRepo)
	activityLogHandler := handlers.NewActivityLogHandler(activityLogService)

	api := r.Group("/api")
	logs := api.Group("/activity-logs")
	logs.Use(middleware.AuthMiddleware())
	logs.Use(middleware.RoleMiddleware("admin"))
	{
		logs.GET("", activityLogHandler.GetAll)
		logs.GET("/:id", activityLogHandler.GetByID)
	}
}
