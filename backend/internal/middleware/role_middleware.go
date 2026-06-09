package middleware

import (
	"net/http"

	"github.com/fiqryomaratala/backend/internal/helpers"
	"github.com/fiqryomaratala/backend/internal/utils"
	"github.com/gin-gonic/gin"
)

func RoleMiddleware(roles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		roleValue, exists := c.Get("role")
		if !exists {
			utils.ErrorResponse(c, http.StatusForbidden, "Forbidden")
			c.Abort()
			return
		}

		role, ok := roleValue.(string)
		if !ok || !helpers.HasRole(role, roles...) {
			utils.ErrorResponse(c, http.StatusForbidden, "Forbidden")
			c.Abort()
			return
		}

		c.Next()
	}
}
