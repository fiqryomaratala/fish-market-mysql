package routes

import (
	"gorm.io/gorm"

	"github.com/fiqryomaratala/backend/internal/handlers"
	"github.com/fiqryomaratala/backend/internal/middleware"
	"github.com/fiqryomaratala/backend/internal/repositories"
	"github.com/fiqryomaratala/backend/internal/services"
	"github.com/gin-gonic/gin"
)

func RegisterAccessRoutes(r *gin.Engine, db *gorm.DB) {
	userRepo := repositories.NewUserRepository(db)
	authService := services.NewAuthService(userRepo)
	authHandler := handlers.NewAuthHandler(authService)
	accessHandler := handlers.NewAccessHandler()

	admin := r.Group("/api/admin")
	admin.Use(middleware.AuthMiddleware())
	admin.Use(middleware.RoleMiddleware("admin"))
	{
		admin.GET("/dashboard", accessHandler.AdminDashboard)
	}

	staff := r.Group("/api/staff")
	staff.Use(middleware.AuthMiddleware())
	staff.Use(middleware.RoleMiddleware("admin", "staff"))
	{
		staff.GET("/dashboard", accessHandler.StaffDashboard)
	}

	customer := r.Group("/api/customer")
	customer.Use(middleware.AuthMiddleware())
	customer.Use(middleware.RoleMiddleware("admin", "staff", "customer"))
	{
		customer.GET("/profile", authHandler.Profile)
	}
}
