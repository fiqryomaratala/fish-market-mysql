package routes

import (
	"gorm.io/gorm"

	"github.com/fiqryomaratala/backend/config"
	"github.com/fiqryomaratala/backend/internal/handlers"
	"github.com/fiqryomaratala/backend/internal/middleware"
	"github.com/fiqryomaratala/backend/internal/repositories"
	"github.com/fiqryomaratala/backend/internal/services"
	"github.com/gin-gonic/gin"
)

func RegisterCheckoutRoutes(r *gin.Engine, db *gorm.DB) {
	checkoutService := services.NewCheckoutService(db)
	checkoutHandler := handlers.NewCheckoutHandler(checkoutService)
	orderRepo := repositories.NewOrderRepository(db)
	inventoryRepo := repositories.NewInventoryRepository(db)
	inventoryTransactionRepo := repositories.NewInventoryTransactionRepository(db)
	productRepo := repositories.NewProductRepository(db)
	inventoryService := services.NewInventoryService(inventoryRepo, inventoryTransactionRepo, productRepo)
	orderService := services.NewOrderService(orderRepo, inventoryService)
	paymentGateway := services.NewXenditPaymentService(config.GetConfig())
	paymentHandler := handlers.NewPaymentHandler(orderService, paymentGateway)

	api := r.Group("/api")
	checkout := api.Group("/checkout")
	checkout.Use(middleware.AuthMiddleware())
	checkout.Use(middleware.RoleMiddleware("customer"))
	{
		checkout.POST("", checkoutHandler.Checkout)
	}

	api.POST("/payments/xendit/webhook", paymentHandler.HandleXenditWebhook)
}
