package handlers

import (
	"errors"
	"net/http"

	"github.com/fiqryomaratala/backend/internal/middleware"
	"github.com/fiqryomaratala/backend/internal/services"
	"github.com/fiqryomaratala/backend/internal/utils"
	appvalidator "github.com/fiqryomaratala/backend/internal/validator"
	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	authService services.AuthService
}

func NewAuthHandler(authService services.AuthService) *AuthHandler {
	return &AuthHandler{authService: authService}
}

type RegisterRequest struct {
	Name     string `json:"name" validate:"required,min=3,max=100"`
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=8"`
}

type RegisterResponse struct {
	ID    uint   `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
	Role  string `json:"role"`
}

type LoginRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}

type UserResponse struct {
	ID    uint   `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
	Role  string `json:"role"`
}

type LoginResponse struct {
	Token string       `json:"token"`
	User  UserResponse `json:"user"`
}

// Register godoc
// @Summary Register user
// @Description Register a new customer account
// @Tags Authentication
// @Accept json
// @Produce json
// @Param request body RegisterRequest true "Register payload"
// @Success 201 {object} APIResponse
// @Failure 400 {object} APIResponse
// @Failure 409 {object} APIResponse
// @Failure 500 {object} APIResponse
// @Router /auth/register [post]
func (h *AuthHandler) Register(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ValidationError(c, appvalidator.FieldError("error", "invalid request body"))
		return
	}
	if err := appvalidator.ValidateStruct(req); err != nil {
		utils.ValidationError(c, appvalidator.FormatValidationErrors(err))
		return
	}

	user, err := h.authService.Register(req.Name, req.Email, req.Password)
	if err != nil {
		if errors.Is(err, services.ErrEmailAlreadyExists) {
			utils.Error(c, http.StatusConflict, "Email already exists")
			return
		}

		middleware.HandleError(c, err)
		return
	}

	utils.Created(c, "Register berhasil", RegisterResponse{
		ID:    user.ID,
		Name:  user.Name,
		Email: user.Email,
		Role:  user.Role,
	})
}

// Login godoc
// @Summary Login user
// @Description Authenticate user and return JWT token
// @Tags Authentication
// @Accept json
// @Produce json
// @Param request body LoginRequest true "Login payload"
// @Success 200 {object} APIResponse
// @Failure 400 {object} APIResponse
// @Failure 401 {object} APIResponse
// @Failure 500 {object} APIResponse
// @Router /auth/login [post]
func (h *AuthHandler) Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ValidationError(c, appvalidator.FieldError("error", "invalid request body"))
		return
	}
	if err := appvalidator.ValidateStruct(req); err != nil {
		utils.ValidationError(c, appvalidator.FormatValidationErrors(err))
		return
	}

	result, err := h.authService.Login(req.Email, req.Password, &services.AuditContext{
		IPAddress: c.ClientIP(),
		UserAgent: c.Request.UserAgent(),
	})
	if err != nil {
		middleware.HandleError(c, err)
		return
	}

	utils.Success(c, "Login successful", LoginResponse{
		Token: result.Token,
		User: UserResponse{
			ID:    result.User.ID,
			Name:  result.User.Name,
			Email: result.User.Email,
			Role:  result.User.Role,
		},
	})
}

// Profile godoc
// @Summary Get user profile
// @Description Get currently authenticated user profile
// @Tags Authentication
// @Produce json
// @Security BearerAuth
// @Success 200 {object} APIResponse
// @Failure 401 {object} APIResponse
// @Failure 500 {object} APIResponse
// @Router /auth/profile [get]
func (h *AuthHandler) Profile(c *gin.Context) {
	userIDValue, exists := c.Get("user_id")
	if !exists {
		utils.Unauthorized(c)
		return
	}

	userID, ok := userIDValue.(uint)
	if !ok {
		utils.Unauthorized(c)
		return
	}

	user, err := h.authService.GetProfile(userID)
	if err != nil {
		if errors.Is(err, services.ErrUserNotFound) {
			utils.Unauthorized(c)
			return
		}

		middleware.HandleError(c, err)
		return
	}

	utils.Success(c, "", gin.H{
		"id":    user.ID,
		"name":  user.Name,
		"email": user.Email,
		"role":  user.Role,
	})
}
