package routes

import (
	"gorm.io/gorm"

	"github.com/fiqryomaratala/backend/internal/handlers"
	"github.com/fiqryomaratala/backend/internal/middleware"
	"github.com/fiqryomaratala/backend/internal/services"
	"github.com/gin-gonic/gin"
)

func RegisterCheckoutRoutes(r *gin.Engine, db *gorm.DB) {
	checkoutService := services.NewCheckoutService(db)
	checkoutHandler := handlers.NewCheckoutHandler(checkoutService)

	api := r.Group("/api")
	checkout := api.Group("/checkout")
	checkout.Use(middleware.AuthMiddleware())
	checkout.Use(middleware.RoleMiddleware("customer"))
	{
		checkout.POST("", checkoutHandler.Checkout)
	}
}
