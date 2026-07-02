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
	orderService := services.NewOrderService(orderRepo)
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
