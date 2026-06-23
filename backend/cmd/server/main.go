package main

import (
	"os"
	"path/filepath"

	"github.com/fiqryomaratala/backend/config"
	_ "github.com/fiqryomaratala/backend/docs"
	"github.com/fiqryomaratala/backend/internal/helpers"
	"github.com/fiqryomaratala/backend/internal/logger"
	"github.com/fiqryomaratala/backend/internal/middleware"
	"github.com/fiqryomaratala/backend/internal/utils"
	"github.com/fiqryomaratala/backend/routes"

	"github.com/gin-gonic/gin"
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
	config.LoadConfig()
	cfg := config.GetConfig()
	logger.InitLogger()
	defer logger.Sync()

	db := config.ConnectDB()
	config.Migrate()
	helpers.InitActivityLogger(db)
	helpers.InitNotificationCenter(db)

	if err := os.MkdirAll(filepath.Join(cfg.UploadPath, "products"), os.ModePerm); err != nil {
		logger.Error("failed to create upload directory", err)
		os.Exit(1)
	}
	if err := os.MkdirAll(filepath.Join(cfg.UploadPath, "profile"), os.ModePerm); err != nil {
		logger.Error("failed to create profile upload directory", err)
		os.Exit(1)
	}

	r := gin.New()
	r.Use(
		middleware.CORSMiddleware(cfg),
		middleware.LoggerMiddleware(),
		middleware.RecoveryMiddleware(),
	)
	r.Static("/uploads", filepath.Clean(cfg.UploadPath))
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
	routes.RegisterUserRoutes(r, db)

	if err := r.Run(":" + cfg.AppPort); err != nil {
		logger.Error("failed to run server", err)
		os.Exit(1)
	}
}
