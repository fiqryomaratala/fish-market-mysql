package middleware

import (
	"net/http"
	"strings"

	"github.com/fiqryomaratala/backend/config"
	"github.com/gin-gonic/gin"
)

type corsSettings struct {
	allowedOrigins   map[string]struct{}
	allowAllOrigins  bool
	allowedMethods   string
	allowedHeaders   string
	allowCredentials string
}

func CORSMiddleware(cfg *config.Config) gin.HandlerFunc {
	settings := newCorsSettings(cfg)

	return func(c *gin.Context) {
		origin := strings.TrimSpace(c.GetHeader("Origin"))
		if origin != "" {
			if settings.allowAllOrigins {
				c.Header("Access-Control-Allow-Origin", "*")
			} else if settings.isOriginAllowed(origin) {
				c.Header("Access-Control-Allow-Origin", origin)
				c.Header("Vary", "Origin")
				c.Header("Access-Control-Allow-Credentials", settings.allowCredentials)
			}

			c.Header("Access-Control-Allow-Methods", settings.allowedMethods)
			c.Header("Access-Control-Allow-Headers", settings.allowedHeaders)
		}

		if c.Request.Method == http.MethodOptions {
			if origin == "" {
				c.AbortWithStatus(http.StatusNoContent)
				return
			}

			if !settings.allowAllOrigins && !settings.isOriginAllowed(origin) {
				c.AbortWithStatusJSON(http.StatusForbidden, gin.H{
					"success": false,
					"message": "CORS origin is not allowed",
				})
				return
			}

			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	}
}

func newCorsSettings(cfg *config.Config) corsSettings {
	allowedOrigins := make(map[string]struct{})
	allowAllOrigins := false

	for _, origin := range strings.Split(cfg.CORSAllowedOrigins, ",") {
		trimmedOrigin := strings.TrimSpace(origin)
		if trimmedOrigin == "" {
			continue
		}

		if trimmedOrigin == "*" {
			allowAllOrigins = true
			continue
		}

		allowedOrigins[trimmedOrigin] = struct{}{}
	}

	return corsSettings{
		allowedOrigins:   allowedOrigins,
		allowAllOrigins:  allowAllOrigins,
		allowedMethods:   "GET, POST, PUT, PATCH, DELETE, OPTIONS",
		allowedHeaders:   "Origin, Content-Type, Content-Length, Accept, Authorization, X-Requested-With",
		allowCredentials: "true",
	}
}

func (c corsSettings) isOriginAllowed(origin string) bool {
	if c.allowAllOrigins {
		return true
	}

	_, exists := c.allowedOrigins[origin]
	return exists
}
