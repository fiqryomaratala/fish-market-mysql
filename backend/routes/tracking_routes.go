package routes

import (
	"gorm.io/gorm"

	"github.com/fiqryomaratala/backend/internal/handlers"
	"github.com/fiqryomaratala/backend/internal/repositories"
	"github.com/fiqryomaratala/backend/internal/services"
	"github.com/gin-gonic/gin"
)

func RegisterTrackingRoutes(r *gin.Engine, db *gorm.DB) {
	batchRepo := repositories.NewFishBatchRepository(db)
	trackingService := services.NewTrackingService(batchRepo)
	trackingHandler := handlers.NewTrackingHandler(trackingService)

	api := r.Group("/api")
	{
		api.GET("/tracking/:batchCode", trackingHandler.GetByBatchCode)
	}
}
