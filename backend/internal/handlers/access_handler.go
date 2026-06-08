package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type AccessHandler struct{}

func NewAccessHandler() *AccessHandler {
	return &AccessHandler{}
}

func (h *AccessHandler) AdminDashboard(c *gin.Context) {
	SuccessResponse(c, http.StatusOK, "Admin dashboard access granted", gin.H{
		"role":    c.GetString("role"),
		"message": "Welcome to admin dashboard",
	})
}

func (h *AccessHandler) StaffDashboard(c *gin.Context) {
	SuccessResponse(c, http.StatusOK, "Staff dashboard access granted", gin.H{
		"role":    c.GetString("role"),
		"message": "Welcome to staff dashboard",
	})
}
