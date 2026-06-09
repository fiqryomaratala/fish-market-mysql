package middleware

import (
	"log"

	"github.com/fiqryomaratala/backend/internal/utils"
	"github.com/gin-gonic/gin"
)

func RecoveryMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		defer func() {
			if recovered := recover(); recovered != nil {
				log.Printf("panic recovered: %v", recovered)
				c.Abort()
				utils.InternalServerError(c)
			}
		}()

		c.Next()
	}
}
