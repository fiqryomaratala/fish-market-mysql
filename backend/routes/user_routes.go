package routes

import (
	"github.com/fiqryomaratala/backend/internal/handlers"
	"github.com/fiqryomaratala/backend/internal/middleware"
	"github.com/fiqryomaratala/backend/internal/repositories"
	"github.com/fiqryomaratala/backend/internal/services"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RegisterUserRoutes(r *gin.Engine, db *gorm.DB) {
	userRepo := repositories.NewUserRepository(db)
	userService := services.NewUserService(userRepo)
	userHandler := handlers.NewUserHandler(userService)

	registerRoutes := func(group *gin.RouterGroup) {
		group.GET("/users", userHandler.GetAll)
		group.GET("/users/:id", userHandler.GetByID)
		group.POST("/users", userHandler.Create)
		group.PUT("/users/:id", userHandler.Update)
		group.DELETE("/users/:id", userHandler.Delete)
		group.PUT("/users/:id/role", userHandler.UpdateRole)
		group.PUT("/users/:id/status", userHandler.UpdateStatus)
	}

	api := r.Group("/api")
	api.Use(middleware.AuthMiddleware())
	api.Use(middleware.RoleMiddleware("admin"))
	{
		registerRoutes(api)
	}

	admin := r.Group("/api/admin")
	admin.Use(middleware.AuthMiddleware())
	admin.Use(middleware.RoleMiddleware("admin"))
	{
		registerRoutes(admin)
	}
}
