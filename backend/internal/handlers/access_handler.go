package handlers

import (
	"github.com/fiqryomaratala/backend/internal/utils"
	"github.com/gin-gonic/gin"
)

type AccessHandler struct{}

func NewAccessHandler() *AccessHandler {
	return &AccessHandler{}
}

// AdminDashboard godoc
// @Summary Admin dashboard access
// @Description Example protected endpoint accessible only by admin
// @Tags Access
// @Produce json
// @Security BearerAuth
// @Success 200 {object} APIResponse
// @Failure 401 {object} APIResponse
// @Failure 403 {object} APIResponse
// @Router /admin/dashboard [get]
func (h *AccessHandler) AdminDashboard(c *gin.Context) {
	utils.Success(c, "Admin dashboard access granted", gin.H{
		"role":    c.GetString("role"),
		"message": "Welcome to admin dashboard",
	})
}

// StaffDashboard godoc
// @Summary Staff dashboard access
// @Description Example protected endpoint accessible by admin and staff
// @Tags Access
// @Produce json
// @Security BearerAuth
// @Success 200 {object} APIResponse
// @Failure 401 {object} APIResponse
// @Failure 403 {object} APIResponse
// @Router /staff/dashboard [get]
func (h *AccessHandler) StaffDashboard(c *gin.Context) {
	utils.Success(c, "Staff dashboard access granted", gin.H{
		"role":    c.GetString("role"),
		"message": "Welcome to staff dashboard",
	})
}
