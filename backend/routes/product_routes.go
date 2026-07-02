package routes

import (
	"path/filepath"

	"github.com/fiqryomaratala/backend/config"
	"gorm.io/gorm"

	"github.com/fiqryomaratala/backend/internal/handlers"
	"github.com/fiqryomaratala/backend/internal/middleware"
	"github.com/fiqryomaratala/backend/internal/repositories"
	"github.com/fiqryomaratala/backend/internal/services"
	"github.com/gin-gonic/gin"
)

func RegisterProductRoutes(r *gin.Engine, db *gorm.DB) {
	productRepo := repositories.NewProductRepository(db)
	inventoryRepo := repositories.NewInventoryRepository(db)
	productService := services.NewProductService(
		productRepo,
		filepath.Join(config.GetConfig().UploadPath, "products"),
		inventoryRepo,
	)
	productHandler := handlers.NewProductHandler(productService)

	api := r.Group("/api")
	{
		api.GET("/products", productHandler.GetAll)
		api.GET("/products/:id", productHandler.GetByID)
	}

	admin := api.Group("/admin")
	admin.Use(middleware.AuthMiddleware())
	admin.Use(middleware.RoleMiddleware("admin"))
	{
		admin.GET("/products", productHandler.GetAllAdmin)
		admin.GET("/products/:id", productHandler.GetByIDAdmin)
		admin.POST("/products", productHandler.Create)
		admin.PUT("/products/:id", productHandler.Update)
		admin.DELETE("/products/:id", productHandler.Delete)
	}
}
