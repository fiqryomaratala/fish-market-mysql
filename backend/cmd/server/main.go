package main

import (
	"log"
	"os"
	"path/filepath"

	"github.com/fiqryomaratala/backend/config"
	_ "github.com/fiqryomaratala/backend/docs"
	"github.com/fiqryomaratala/backend/internal/helpers"
	"github.com/fiqryomaratala/backend/internal/middleware"
	"github.com/fiqryomaratala/backend/internal/utils"
	"github.com/fiqryomaratala/backend/routes"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

// @title Fish Market & Aquaculture API
// @version 1.0
// @description Backend API for fish marketplace and aquaculture management.
// @BasePath /api
// @schemes http https
// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization

func main() {
	godotenv.Load()

	db := config.ConnectDB()
	config.Migrate()
	helpers.InitActivityLogger(db)
	helpers.InitNotificationCenter(db)

	if err := os.MkdirAll(filepath.Join("uploads", "products"), os.ModePerm); err != nil {
		log.Fatal("Failed to create upload directory:", err)
	}

	r := gin.New()
	r.Use(gin.Logger(), middleware.RecoveryMiddleware())
	r.Static("/uploads", "./uploads")
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	r.GET("/", func(c *gin.Context) {
		utils.Success(c, "Fish Market API Running", nil)
	})

	routes.RegisterAuthRoutes(r, db)
	routes.RegisterAccessRoutes(r, db)
	routes.RegisterProductRoutes(r, db)
	routes.RegisterPondRoutes(r, db)
	routes.RegisterFishBatchRoutes(r, db)
	routes.RegisterFeedingLogRoutes(r, db)
	routes.RegisterHarvestRoutes(r, db)
	routes.RegisterTrackingRoutes(r, db)
	routes.RegisterDashboardRoutes(r, db)
	routes.RegisterReportRoutes(r, db)
	routes.RegisterActivityLogRoutes(r, db)
	routes.RegisterInventoryRoutes(r, db)
	routes.RegisterCartRoutes(r, db)
	routes.RegisterCheckoutRoutes(r, db)
	routes.RegisterOrderRoutes(r, db)
	routes.RegisterNotificationRoutes(r, db)

	r.Run(":" + os.Getenv("APP_PORT"))
}
