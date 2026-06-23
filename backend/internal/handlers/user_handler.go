package handlers

import (
	"errors"
	"net/http"
	"strconv"
	"time"

	"github.com/fiqryomaratala/backend/internal/models"
	"github.com/fiqryomaratala/backend/internal/services"
	"github.com/fiqryomaratala/backend/internal/utils"
	appvalidator "github.com/fiqryomaratala/backend/internal/validator"
	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	userService services.UserService
}

type UserDetailResponse struct {
	ID        uint      `json:"id"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	Phone     string    `json:"phone"`
	Address   string    `json:"address"`
	Avatar    string    `json:"avatar"`
	Role      string    `json:"role"`
	Status    string    `json:"status"`
	LastLogin string    `json:"last_login"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type CreateUserRequest struct {
	Name     string `json:"name" validate:"required"`
	Email    string `json:"email" validate:"required,email"`
	Phone    string `json:"phone" validate:"required"`
	Address  string `json:"address" validate:"required"`
	Password string `json:"password" validate:"required,min=8"`
	Role     string `json:"role" validate:"required,oneof=Admin Staff Customer"`
	Status   string `json:"status" validate:"required,oneof=Active Inactive Suspended"`
}

type UpdateUserRequest struct {
	Name    string `json:"name" validate:"required"`
	Phone   string `json:"phone" validate:"required"`
	Address string `json:"address" validate:"required"`
	Role    string `json:"role" validate:"required,oneof=Admin Staff Customer"`
	Status  string `json:"status" validate:"required,oneof=Active Inactive Suspended"`
}

type UpdateRoleRequest struct {
	Role string `json:"role" validate:"required,oneof=Admin Staff Customer"`
}

type UpdateStatusRequest struct {
	Status string `json:"status" validate:"required,oneof=Active Inactive Suspended"`
}

func NewUserHandler(userService services.UserService) *UserHandler {
	return &UserHandler{userService: userService}
}

func mapUserToResponse(user *models.User) UserDetailResponse {
	lastLogin := ""
	if user.LastLogin != nil {
		lastLogin = user.LastLogin.Format(time.RFC3339)
	}

	return UserDetailResponse{
		ID:        user.ID,
		Name:      user.Name,
		Email:     user.Email,
		Phone:     user.Phone,
		Address:   user.Address,
		Avatar:    user.PhotoURL,
		Role:      user.Role,
		Status:    user.Status,
		LastLogin: lastLogin,
		CreatedAt: user.CreatedAt,
		UpdatedAt: user.UpdatedAt,
	}
}

func (h *UserHandler) GetAll(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	search := c.Query("search")
	role := c.Query("role")
	status := c.Query("status")

	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 100
	}

	result, err := h.userService.GetAll(services.UserListParams{
		Search: search,
		Role:   role,
		Status: status,
		Page:   page,
		Limit:  limit,
	})
	if err != nil {
		utils.Error(c, http.StatusInternalServerError, "Failed to fetch users")
		return
	}

	items := make([]UserDetailResponse, len(result.Users))
	for i, user := range result.Users {
		items[i] = mapUserToResponse(&user)
	}

	utils.Success(c, "Users retrieved successfully", gin.H{
		"items": items,
		"meta": gin.H{
			"page":  result.Page,
			"limit": result.Limit,
			"total": result.Total,
		},
	})
}

func (h *UserHandler) GetByID(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.Error(c, http.StatusBadRequest, "Invalid user ID")
		return
	}

	user, err := h.userService.GetByID(uint(id))
	if err != nil {
		if errors.Is(err, services.ErrUserNotFound) {
			utils.Error(c, http.StatusNotFound, "User not found")
			return
		}
		utils.Error(c, http.StatusInternalServerError, "Failed to fetch user")
		return
	}

	utils.Success(c, "User retrieved successfully", mapUserToResponse(user))
}

func (h *UserHandler) Create(c *gin.Context) {
	var input CreateUserRequest
	if err := c.ShouldBindJSON(&input); err != nil {
		utils.Error(c, http.StatusBadRequest, "Invalid request body")
		return
	}

	if errs := appvalidator.ValidateStruct(input); errs != nil {
		utils.ValidationError(c, errs)
		return
	}

	user, err := h.userService.Create(services.CreateUserInput{
		Name:     input.Name,
		Email:    input.Email,
		Phone:    input.Phone,
		Address:  input.Address,
		Password: input.Password,
		Role:     input.Role,
		Status:   input.Status,
		Audit:    auditContextFromGin(c),
	})
	if err != nil {
		if errors.Is(err, services.ErrEmailAlreadyExists) {
			utils.ValidationError(c, appvalidator.FieldError("email", "email sudah terdaftar"))
			return
		}
		if errors.Is(err, services.ErrInvalidRole) {
			utils.ValidationError(c, appvalidator.FieldError("role", "role tidak valid"))
			return
		}
		if errors.Is(err, services.ErrInvalidStatus) {
			utils.ValidationError(c, appvalidator.FieldError("status", "status tidak valid"))
			return
		}
		utils.Error(c, http.StatusInternalServerError, "Failed to create user")
		return
	}

	utils.Created(c, "User created successfully", mapUserToResponse(user))
}

func (h *UserHandler) Update(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.Error(c, http.StatusBadRequest, "Invalid user ID")
		return
	}

	var input UpdateUserRequest
	if err := c.ShouldBindJSON(&input); err != nil {
		utils.Error(c, http.StatusBadRequest, "Invalid request body")
		return
	}

	if errs := appvalidator.ValidateStruct(input); errs != nil {
		utils.ValidationError(c, errs)
		return
	}

	user, err := h.userService.Update(uint(id), services.UpdateUserInput{
		Name:    input.Name,
		Phone:   input.Phone,
		Address: input.Address,
		Role:    input.Role,
		Status:  input.Status,
		Audit:   auditContextFromGin(c),
	})
	if err != nil {
		if errors.Is(err, services.ErrUserNotFound) {
			utils.Error(c, http.StatusNotFound, "User not found")
			return
		}
		if errors.Is(err, services.ErrInvalidRole) {
			utils.ValidationError(c, appvalidator.FieldError("role", "role tidak valid"))
			return
		}
		if errors.Is(err, services.ErrInvalidStatus) {
			utils.ValidationError(c, appvalidator.FieldError("status", "status tidak valid"))
			return
		}
		utils.Error(c, http.StatusInternalServerError, "Failed to update user")
		return
	}

	utils.Success(c, "User updated successfully", mapUserToResponse(user))
}

func (h *UserHandler) Delete(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.Error(c, http.StatusBadRequest, "Invalid user ID")
		return
	}

	userID, exists := c.Get("user_id")
	if !exists {
		utils.Error(c, http.StatusUnauthorized, "Unauthorized")
		return
	}
	currentUserID, _ := userID.(uint)
	if currentUserID == uint(id) {
		utils.Error(c, http.StatusForbidden, "Cannot delete your own account")
		return
	}

	if err := h.userService.Delete(uint(id), auditContextFromGin(c)); err != nil {
		if errors.Is(err, services.ErrUserNotFound) {
			utils.Error(c, http.StatusNotFound, "User not found")
			return
		}
		utils.Error(c, http.StatusInternalServerError, "Failed to delete user")
		return
	}

	utils.Success(c, "User deleted successfully", nil)
}

func (h *UserHandler) UpdateRole(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.Error(c, http.StatusBadRequest, "Invalid user ID")
		return
	}

	var input UpdateRoleRequest
	if err := c.ShouldBindJSON(&input); err != nil {
		utils.Error(c, http.StatusBadRequest, "Invalid request body")
		return
	}

	if errs := appvalidator.ValidateStruct(input); errs != nil {
		utils.ValidationError(c, errs)
		return
	}

	user, err := h.userService.UpdateRole(uint(id), input.Role, auditContextFromGin(c))
	if err != nil {
		if errors.Is(err, services.ErrUserNotFound) {
			utils.Error(c, http.StatusNotFound, "User not found")
			return
		}
		if errors.Is(err, services.ErrInvalidRole) {
			utils.ValidationError(c, appvalidator.FieldError("role", "role tidak valid"))
			return
		}
		utils.Error(c, http.StatusInternalServerError, "Failed to update user role")
		return
	}

	utils.Success(c, "User role updated successfully", mapUserToResponse(user))
}

func (h *UserHandler) UpdateStatus(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.Error(c, http.StatusBadRequest, "Invalid user ID")
		return
	}

	var input UpdateStatusRequest
	if err := c.ShouldBindJSON(&input); err != nil {
		utils.Error(c, http.StatusBadRequest, "Invalid request body")
		return
	}

	if errs := appvalidator.ValidateStruct(input); errs != nil {
		utils.ValidationError(c, errs)
		return
	}

	userID, exists := c.Get("user_id")
	if !exists {
		utils.Error(c, http.StatusUnauthorized, "Unauthorized")
		return
	}
	currentUserID, _ := userID.(uint)
	if currentUserID == uint(id) && input.Status != "Active" {
		utils.Error(c, http.StatusForbidden, "Cannot change your own account status")
		return
	}

	user, err := h.userService.UpdateStatus(uint(id), input.Status, auditContextFromGin(c))
	if err != nil {
		if errors.Is(err, services.ErrUserNotFound) {
			utils.Error(c, http.StatusNotFound, "User not found")
			return
		}
		if errors.Is(err, services.ErrInvalidStatus) {
			utils.ValidationError(c, appvalidator.FieldError("status", "status tidak valid"))
			return
		}
		utils.Error(c, http.StatusInternalServerError, "Failed to update user status")
		return
	}

	utils.Success(c, "User status updated successfully", mapUserToResponse(user))
}
