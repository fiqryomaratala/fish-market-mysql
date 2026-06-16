package handlers

import (
	"errors"
	"net/http"
	"path/filepath"

	"github.com/fiqryomaratala/backend/config"
	"github.com/fiqryomaratala/backend/internal/helpers"
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

type UpdateProfileRequest struct {
	Name    string `json:"name" validate:"required,min=1,max=100"`
	Phone   string `json:"phone" validate:"required,max=30"`
	Address string `json:"address" validate:"required,max=255"`
}

type ChangePasswordRequest struct {
	CurrentPassword string `json:"current_password" validate:"required"`
	NewPassword     string `json:"new_password" validate:"required,min=8"`
	ConfirmPassword string `json:"confirm_password" validate:"required,min=8"`
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
// @Router /profile [get]
// @Router /auth/profile [get]
// @Router /customer/profile [get]
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
		"id":         user.ID,
		"name":       user.Name,
		"email":      user.Email,
		"phone":      user.Phone,
		"address":    user.Address,
		"role":       user.Role,
		"photo_url":  user.PhotoURL,
		"created_at": user.CreatedAt,
	})
}

func (h *AuthHandler) UpdateProfile(c *gin.Context) {
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

	var req UpdateProfileRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ValidationError(c, appvalidator.FieldError("error", "invalid request body"))
		return
	}
	if err := appvalidator.ValidateStruct(req); err != nil {
		utils.ValidationError(c, appvalidator.FormatValidationErrors(err))
		return
	}

	user, err := h.authService.UpdateProfile(userID, req.Name, req.Phone, req.Address, auditContextFromGin(c))
	if err != nil {
		if errors.Is(err, services.ErrUserNotFound) {
			utils.Unauthorized(c)
			return
		}

		middleware.HandleError(c, err)
		return
	}

	utils.Success(c, "Profile berhasil diperbarui", gin.H{
		"id":         user.ID,
		"name":       user.Name,
		"email":      user.Email,
		"phone":      user.Phone,
		"address":    user.Address,
		"role":       user.Role,
		"photo_url":  user.PhotoURL,
		"created_at": user.CreatedAt,
	})
}

// ChangePassword godoc
// @Summary Change user password
// @Description Change password for the currently authenticated user
// @Tags Authentication
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param request body ChangePasswordRequest true "Change password payload"
// @Success 200 {object} APIResponse
// @Failure 400 {object} APIResponse
// @Failure 401 {object} APIResponse
// @Failure 500 {object} APIResponse
// @Router /profile/password [put]
func (h *AuthHandler) ChangePassword(c *gin.Context) {
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

	var req ChangePasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ValidationError(c, appvalidator.FieldError("error", "invalid request body"))
		return
	}
	if err := appvalidator.ValidateStruct(req); err != nil {
		utils.ValidationError(c, appvalidator.FormatValidationErrors(err))
		return
	}

	err := h.authService.ChangePassword(
		userID,
		req.CurrentPassword,
		req.NewPassword,
		req.ConfirmPassword,
		auditContextFromGin(c),
	)
	if err != nil {
		if errors.Is(err, services.ErrPasswordConfirmationMismatch) {
			utils.ValidationError(c, appvalidator.FieldError("confirm_password", "confirm_password does not match new_password"))
			return
		}
		if errors.Is(err, services.ErrCurrentPasswordIncorrect) {
			utils.Error(c, http.StatusUnauthorized, "Current password is incorrect")
			return
		}
		if errors.Is(err, services.ErrUserNotFound) {
			utils.Unauthorized(c)
			return
		}

		middleware.HandleError(c, err)
		return
	}

	utils.Success(c, "Password berhasil diperbarui", nil)
}

func (h *AuthHandler) UploadProfilePhoto(c *gin.Context) {
	userIDValue, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"status":  "error",
			"message": "Unauthorized",
		})
		return
	}

	userID, ok := userIDValue.(uint)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{
			"status":  "error",
			"message": "Unauthorized",
		})
		return
	}

	file, err := c.FormFile("photo")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "File photo wajib diunggah",
		})
		return
	}

	cfg := config.GetConfig()
	uploadDir := filepath.Join(cfg.UploadPath, "profile")
	photoURL, err := helpers.SaveUploadedProfilePhoto(file, uploadDir, userID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": err.Error(),
		})
		return
	}

	user, err := h.authService.UpdateProfilePhoto(userID, photoURL, auditContextFromGin(c))
	if err != nil {
		_ = helpers.DeleteUploadedFile(photoURL)

		statusCode := http.StatusInternalServerError
		message := "Gagal mengupdate foto profil"
		if errors.Is(err, services.ErrUserNotFound) {
			statusCode = http.StatusUnauthorized
			message = "Unauthorized"
		}

		c.JSON(statusCode, gin.H{
			"status":  "error",
			"message": message,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Foto profil berhasil diupdate",
		"data": gin.H{
			"photo_url": user.PhotoURL,
		},
	})
}
