package handlers

import (
	"github.com/fiqryomaratala/backend/internal/services"
	"github.com/gin-gonic/gin"
)

func auditContextFromGin(c *gin.Context) *services.AuditContext {
	userID, _ := c.Get("user_id")
	parsedUserID, _ := userID.(uint)

	return &services.AuditContext{
		UserID:    parsedUserID,
		IPAddress: c.ClientIP(),
		UserAgent: c.Request.UserAgent(),
	}
}
