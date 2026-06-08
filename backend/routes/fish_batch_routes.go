package routes

import (
	"gorm.io/gorm"

	"github.com/fiqryomaratala/backend/internal/handlers"
	"github.com/fiqryomaratala/backend/internal/middleware"
	"github.com/fiqryomaratala/backend/internal/repositories"
	"github.com/fiqryomaratala/backend/internal/services"
	"github.com/gin-gonic/gin"
)

func RegisterFishBatchRoutes(r *gin.Engine, db *gorm.DB) {
	pondRepo := repositories.NewPondRepository(db)
	batchRepo := repositories.NewFishBatchRepository(db)
	batchService := services.NewFishBatchService(batchRepo, pondRepo)
	batchHandler := handlers.NewFishBatchHandler(batchService)

	api := r.Group("/api")
	batches := api.Group("/batches")
	batches.Use(middleware.AuthMiddleware())
	batches.Use(middleware.RoleMiddleware("admin", "staff"))
	{
		batches.POST("", batchHandler.Create)
		batches.GET("", batchHandler.GetAll)
		batches.GET("/:id", batchHandler.GetByID)
		batches.PUT("/:id", batchHandler.Update)
		batches.DELETE("/:id", middleware.RoleMiddleware("admin"), batchHandler.Delete)
	}
}
