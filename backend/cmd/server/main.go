package main

import (
	"log"
	"os"
	"path/filepath"

	"github.com/fiqryomaratala/backend/config"
	"github.com/fiqryomaratala/backend/internal/helpers"
	"github.com/fiqryomaratala/backend/routes"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load()

	db := config.ConnectDB()
	config.Migrate()
	helpers.InitActivityLogger(db)

	if err := os.MkdirAll(filepath.Join("uploads", "products"), os.ModePerm); err != nil {
		log.Fatal("Failed to create upload directory:", err)
	}

	r := gin.Default()
	r.Static("/uploads", "./uploads")

	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Fish Market API Running",
		})
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

	r.Run(":" + os.Getenv("APP_PORT"))
}
