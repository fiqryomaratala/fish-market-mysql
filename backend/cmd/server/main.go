package main

import (
	"errors"
	"fmt"
	"net"
	"os"
	"path/filepath"
	"strings"

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
	"go.uber.org/zap"
)

// @title Fish Market & Aquaculture API
// @version 1.0
// @description Backend API for fish marketplace and aquaculture management.
// @BasePath /api
// @schemes http https
// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization

func buildCandidatePorts(primaryPort, fallbackPorts string) []string {
	seen := make(map[string]struct{})
	candidates := make([]string, 0, 5)

	appendPort := func(value string) {
		port := strings.TrimSpace(value)
		if port == "" {
			return
		}

		if _, exists := seen[port]; exists {
			return
		}

		seen[port] = struct{}{}
		candidates = append(candidates, port)
	}

	appendPort(primaryPort)

	for _, port := range strings.Split(fallbackPorts, ",") {
		appendPort(port)
	}

	return candidates
}

func runServerWithFallback(r *gin.Engine, candidatePorts []string) error {
	var bindErrors []string

	for _, port := range candidatePorts {
		address := ":" + port
		listener, err := net.Listen("tcp", address)
		if err != nil {
			logger.Warn("port unavailable, trying next candidate",
				zap.String("address", address),
				zap.String("reason", err.Error()),
			)
			bindErrors = append(bindErrors, fmt.Sprintf("%s -> %v", address, err))
			continue
		}

		logger.Info("server listening",
			zap.String("address", address),
		)

		if serveErr := r.RunListener(listener); serveErr != nil && !errors.Is(serveErr, net.ErrClosed) {
			_ = listener.Close()
			return serveErr
		}

		return nil
	}

	return fmt.Errorf("failed to bind server to candidate ports: %s", strings.Join(bindErrors, "; "))
}

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

	candidatePorts := buildCandidatePorts(cfg.AppPort, cfg.AppFallbackPorts)
	if err := runServerWithFallback(r, candidatePorts); err != nil {
		logger.Error("failed to run server", err)
		os.Exit(1)
	}
}
