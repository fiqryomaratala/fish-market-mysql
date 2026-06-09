package routes

import (
	"gorm.io/gorm"

	"github.com/fiqryomaratala/backend/internal/handlers"
	"github.com/fiqryomaratala/backend/internal/middleware"
	"github.com/fiqryomaratala/backend/internal/repositories"
	"github.com/fiqryomaratala/backend/internal/services"
	"github.com/gin-gonic/gin"
)

func RegisterCartRoutes(r *gin.Engine, db *gorm.DB) {
	cartRepo := repositories.NewCartRepository(db)
	productRepo := repositories.NewProductRepository(db)
	inventoryRepo := repositories.NewInventoryRepository(db)
	cartService := services.NewCartService(cartRepo, productRepo, inventoryRepo)
	cartHandler := handlers.NewCartHandler(cartService)

	api := r.Group("/api")
	cart := api.Group("/cart")
	cart.Use(middleware.AuthMiddleware())
	cart.Use(middleware.RoleMiddleware("customer"))
	{
		cart.POST("", cartHandler.Add)
		cart.GET("", cartHandler.GetAll)
		cart.PUT("/:id", cartHandler.Update)
		cart.DELETE("/:id", cartHandler.Delete)
		cart.DELETE("", cartHandler.Clear)
	}
}
