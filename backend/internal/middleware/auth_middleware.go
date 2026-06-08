package middleware

import (
	"errors"
	"net/http"
	"strings"

	"github.com/fiqryomaratala/backend/internal/handlers"
	"github.com/fiqryomaratala/backend/internal/helpers"
	"github.com/gin-gonic/gin"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			handlers.ErrorResponse(c, http.StatusUnauthorized, "Unauthorized")
			c.Abort()
			return
		}

		tokenParts := strings.SplitN(authHeader, " ", 2)
		if len(tokenParts) != 2 || !strings.EqualFold(tokenParts[0], "Bearer") || strings.TrimSpace(tokenParts[1]) == "" {
			handlers.ErrorResponse(c, http.StatusUnauthorized, "Invalid token")
			c.Abort()
			return
		}

		claims, err := helpers.ValidateToken(strings.TrimSpace(tokenParts[1]))
		if err != nil {
			if errors.Is(err, helpers.ErrInvalidToken) {
				handlers.ErrorResponse(c, http.StatusUnauthorized, "Invalid token")
				c.Abort()
				return
			}

			handlers.ErrorResponse(c, http.StatusUnauthorized, "Invalid token")
			c.Abort()
			return
		}

		c.Set("user_id", claims.UserID)
		c.Set("email", claims.Email)
		c.Set("role", claims.Role)
		c.Next()
	}
}
