package routes

import (
	"gorm.io/gorm"

	"github.com/fiqryomaratala/backend/internal/handlers"
	"github.com/fiqryomaratala/backend/internal/middleware"
	"github.com/fiqryomaratala/backend/internal/repositories"
	"github.com/fiqryomaratala/backend/internal/services"
	"github.com/gin-gonic/gin"
)

func RegisterHarvestRoutes(r *gin.Engine, db *gorm.DB) {
	batchRepo := repositories.NewFishBatchRepository(db)
	harvestRepo := repositories.NewHarvestRepository(db)
	productRepo := repositories.NewProductRepository(db)
	inventoryRepo := repositories.NewInventoryRepository(db)
	transactionRepo := repositories.NewInventoryTransactionRepository(db)
	inventoryService := services.NewInventoryService(inventoryRepo, transactionRepo, productRepo)
	harvestService := services.NewHarvestService(harvestRepo, batchRepo, inventoryService)
	harvestHandler := handlers.NewHarvestHandler(harvestService)

	api := r.Group("/api")
	harvests := api.Group("/harvests")
	harvests.Use(middleware.AuthMiddleware())
	harvests.Use(middleware.RoleMiddleware("admin", "staff"))
	{
		harvests.POST("", harvestHandler.Create)
		harvests.GET("", harvestHandler.GetAll)
		harvests.GET("/summary", harvestHandler.Summary)
		harvests.GET("/:id", harvestHandler.GetByID)
		harvests.PUT("/:id", harvestHandler.Update)
		harvests.DELETE("/:id", middleware.RoleMiddleware("admin"), harvestHandler.Delete)
	}
}
