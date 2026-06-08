package routes

import (
	"gorm.io/gorm"

	"github.com/fiqryomaratala/backend/internal/handlers"
	"github.com/fiqryomaratala/backend/internal/middleware"
	"github.com/fiqryomaratala/backend/internal/repositories"
	"github.com/fiqryomaratala/backend/internal/services"
	"github.com/gin-gonic/gin"
)

func RegisterPondRoutes(r *gin.Engine, db *gorm.DB) {
	pondRepo := repositories.NewPondRepository(db)
	pondService := services.NewPondService(pondRepo)
	pondHandler := handlers.NewPondHandler(pondService)

	api := r.Group("/api")
	ponds := api.Group("/ponds")
	ponds.Use(middleware.AuthMiddleware())
	ponds.Use(middleware.RoleMiddleware("admin", "staff"))
	{
		ponds.POST("", pondHandler.Create)
		ponds.GET("", pondHandler.GetAll)
		ponds.GET("/:id", pondHandler.GetByID)
		ponds.PUT("/:id", pondHandler.Update)
		ponds.DELETE("/:id", middleware.RoleMiddleware("admin"), pondHandler.Delete)
	}
}
