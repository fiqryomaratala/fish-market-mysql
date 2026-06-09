package middleware

import (
	"time"

	"github.com/fiqryomaratala/backend/internal/logger"
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

func LoggerMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()

		c.Next()

		fields := []zap.Field{
			zap.String("method", c.Request.Method),
			zap.String("path", c.Request.URL.Path),
			zap.Int("status", c.Writer.Status()),
			zap.Duration("latency", time.Since(start)),
			zap.String("ip", c.ClientIP()),
			zap.String("user_agent", c.Request.UserAgent()),
			zap.Int("response_size", c.Writer.Size()),
		}

		if userIDValue, exists := c.Get("user_id"); exists {
			fields = append(fields, zap.Any("user_id", userIDValue))
		}

		if roleValue, exists := c.Get("role"); exists {
			fields = append(fields, zap.Any("role", roleValue))
		}

		logger.Info("http request", fields...)
	}
}
