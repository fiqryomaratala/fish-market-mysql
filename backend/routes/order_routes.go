package routes

import (
	"gorm.io/gorm"

	"github.com/fiqryomaratala/backend/internal/handlers"
	"github.com/fiqryomaratala/backend/internal/middleware"
	"github.com/fiqryomaratala/backend/internal/repositories"
	"github.com/fiqryomaratala/backend/internal/services"
	"github.com/gin-gonic/gin"
)

func RegisterOrderRoutes(r *gin.Engine, db *gorm.DB) {
	orderRepo := repositories.NewOrderRepository(db)
	orderService := services.NewOrderService(orderRepo)
	orderHandler := handlers.NewOrderHandler(orderService)

	api := r.Group("/api")
	orders := api.Group("/orders")
	orders.Use(middleware.AuthMiddleware())
	{
		orders.GET("", orderHandler.GetAll)
		orders.GET("/:id", orderHandler.GetByID)
		orders.PUT("/:id/status", middleware.RoleMiddleware("admin"), orderHandler.UpdateStatus)
		orders.PUT("/:id/payment", middleware.RoleMiddleware("admin"), orderHandler.UpdatePayment)
	}
}
