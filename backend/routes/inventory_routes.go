package routes

import (
	"gorm.io/gorm"

	"github.com/fiqryomaratala/backend/internal/handlers"
	"github.com/fiqryomaratala/backend/internal/middleware"
	"github.com/fiqryomaratala/backend/internal/repositories"
	"github.com/fiqryomaratala/backend/internal/services"
	"github.com/gin-gonic/gin"
)

func RegisterInventoryRoutes(r *gin.Engine, db *gorm.DB) {
	productRepo := repositories.NewProductRepository(db)
	inventoryRepo := repositories.NewInventoryRepository(db)
	transactionRepo := repositories.NewInventoryTransactionRepository(db)
	inventoryService := services.NewInventoryService(inventoryRepo, transactionRepo, productRepo)
	inventoryHandler := handlers.NewInventoryHandler(inventoryService)

	api := r.Group("/api")
	inventory := api.Group("/inventory")
	inventory.Use(middleware.AuthMiddleware())
	inventory.Use(middleware.RoleMiddleware("admin", "staff"))
	{
		inventory.GET("", inventoryHandler.GetAll)
		inventory.GET("/transactions", middleware.RoleMiddleware("admin"), inventoryHandler.GetTransactions)
		inventory.POST("/adjustment", middleware.RoleMiddleware("admin"), inventoryHandler.Adjust)
		inventory.GET("/:id", inventoryHandler.GetByID)
	}
}
