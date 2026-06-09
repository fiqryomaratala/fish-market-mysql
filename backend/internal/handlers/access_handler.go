package handlers

import (
	"github.com/fiqryomaratala/backend/internal/utils"
	"github.com/gin-gonic/gin"
)

type AccessHandler struct{}

func NewAccessHandler() *AccessHandler {
	return &AccessHandler{}
}

func (h *AccessHandler) AdminDashboard(c *gin.Context) {
	utils.Success(c, "Admin dashboard access granted", gin.H{
		"role":    c.GetString("role"),
		"message": "Welcome to admin dashboard",
	})
}

func (h *AccessHandler) StaffDashboard(c *gin.Context) {
	utils.Success(c, "Staff dashboard access granted", gin.H{
		"role":    c.GetString("role"),
		"message": "Welcome to staff dashboard",
	})
}
