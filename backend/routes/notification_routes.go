package routes

import (
	"gorm.io/gorm"

	"github.com/fiqryomaratala/backend/internal/handlers"
	"github.com/fiqryomaratala/backend/internal/middleware"
	"github.com/fiqryomaratala/backend/internal/repositories"
	"github.com/fiqryomaratala/backend/internal/services"
	"github.com/gin-gonic/gin"
)

func RegisterNotificationRoutes(r *gin.Engine, db *gorm.DB) {
	notificationRepo := repositories.NewNotificationRepository(db)
	notificationService := services.NewNotificationService(notificationRepo)
	notificationHandler := handlers.NewNotificationHandler(notificationService)

	api := r.Group("/api")
	notifications := api.Group("/notifications")
	notifications.Use(middleware.AuthMiddleware())
	notifications.Use(middleware.RoleMiddleware("admin", "staff", "customer"))
	{
		notifications.GET("", notificationHandler.GetAll)
		notifications.GET("/unread", notificationHandler.GetUnread)
		notifications.PUT("/read-all", notificationHandler.MarkAllAsRead)
		notifications.PUT("/:id/read", notificationHandler.MarkAsRead)
		notifications.DELETE("/:id", notificationHandler.Delete)
	}
}
