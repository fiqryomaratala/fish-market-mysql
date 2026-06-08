package main

import (
	"os"

	"github.com/fiqryomaratala/backend/config"
	"github.com/fiqryomaratala/backend/routes"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load()

	db := config.ConnectDB()
	config.Migrate()

	r := gin.Default()

	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Fish Market API Running",
		})
	})

	routes.RegisterAuthRoutes(r, db)

	r.Run(":" + os.Getenv("APP_PORT"))
}
