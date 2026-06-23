package services

import (
	"errors"
	"strconv"
	"time"

	"github.com/fiqryomaratala/backend/internal/helpers"
	"github.com/fiqryomaratala/backend/internal/logger"
	"github.com/fiqryomaratala/backend/internal/models"
	"github.com/fiqryomaratala/backend/internal/repositories"
	"go.uber.org/zap"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

var ErrInvalidRole = errors.New("invalid role")
var ErrInvalidStatus = errors.New("invalid status")

var ValidRoles = []string{"Admin", "Staff", "Customer"}
var ValidStatuses = []string{"Active", "Inactive", "Suspended"}

type UserListParams struct {
	Search string
	Role   string
	Status string
	Page   int
	Limit  int
}

type UserListResult struct {
	Users []models.User
	Total int64
	Page  int
	Limit int
}

type CreateUserInput struct {
	Name     string
	Email    string
	Phone    string
	Address  string
	Password string
	Role     string
	Status   string
	Audit    *AuditContext
}

type UpdateUserInput struct {
	Name    string
	Phone   string
	Address string
	Role    string
	Status  string
	Audit   *AuditContext
}

type UserService interface {
	GetAll(params UserListParams) (*UserListResult, error)
	GetByID(id uint) (*models.User, error)
	Create(input CreateUserInput) (*models.User, error)
	Update(id uint, input UpdateUserInput) (*models.User, error)
	Delete(id uint, audit *AuditContext) error
	UpdateRole(id uint, role string, audit *AuditContext) (*models.User, error)
	UpdateStatus(id uint, status string, audit *AuditContext) (*models.User, error)
}

type userService struct {
	userRepo repositories.UserRepository
}

func NewUserService(userRepo repositories.UserRepository) UserService {
	return &userService{userRepo: userRepo}
}

func (s *userService) GetAll(params UserListParams) (*UserListResult, error) {
	filter := repositories.UserFilter{
		Search: params.Search,
		Role:   params.Role,
		Status: params.Status,
		Page:   params.Page,
		Limit:  params.Limit,
	}

	users, total, err := s.userRepo.FindAll(filter)
	if err != nil {
		logger.Error("failed to fetch users", err, zap.Any("filter", filter))
		return nil, err
	}

	return &UserListResult{
		Users: users,
		Total: total,
		Page:  params.Page,
		Limit: params.Limit,
	}, nil
}

func (s *userService) GetByID(id uint) (*models.User, error) {
	user, err := s.userRepo.FindByID(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrUserNotFound
		}
		logger.Error("failed to fetch user by ID", err, zap.Uint("id", id))
		return nil, err
	}
	return user, nil
}

func (s *userService) Create(input CreateUserInput) (*models.User, error) {
	if !isValidRole(input.Role) {
		return nil, ErrInvalidRole
	}

	if !isValidStatus(input.Status) {
		return nil, ErrInvalidStatus
	}

	existing, _ := s.userRepo.FindByEmail(input.Email)
	if existing != nil {
		return nil, ErrEmailAlreadyExists
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		logger.Error("failed to hash password", err)
		return nil, err
	}

	user := &models.User{
		Name:     input.Name,
		Email:    input.Email,
		Phone:    input.Phone,
		Address:  input.Address,
		Password: string(hashedPassword),
		Role:     input.Role,
		Status:   input.Status,
	}

	if err := s.userRepo.Create(user); err != nil {
		logger.Error("failed to create user", err, zap.String("email", input.Email))
		return nil, err
	}

	if input.Audit != nil {
		description := "Created user: " + user.Name + " (" + user.Email + ")"
		helpers.LogActivity(input.Audit.UserID, "create", "user", description, input.Audit.IPAddress, input.Audit.UserAgent)
	}

	return user, nil
}

func (s *userService) Update(id uint, input UpdateUserInput) (*models.User, error) {
	user, err := s.userRepo.FindByID(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrUserNotFound
		}
		return nil, err
	}

	if !isValidRole(input.Role) {
		return nil, ErrInvalidRole
	}

	if !isValidStatus(input.Status) {
		return nil, ErrInvalidStatus
	}

	user.Name = input.Name
	user.Phone = input.Phone
	user.Address = input.Address
	user.Role = input.Role
	user.Status = input.Status

	if err := s.userRepo.Update(user); err != nil {
		logger.Error("failed to update user", err, zap.Uint("id", id))
		return nil, err
	}

	if input.Audit != nil {
		description := "Updated user: " + user.Name + " (ID: " + strconv.Itoa(int(user.ID)) + ")"
		helpers.LogActivity(input.Audit.UserID, "update", "user", description, input.Audit.IPAddress, input.Audit.UserAgent)
	}

	return user, nil
}

func (s *userService) Delete(id uint, audit *AuditContext) error {
	user, err := s.userRepo.FindByID(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return ErrUserNotFound
		}
		return err
	}

	if err := s.userRepo.Delete(user); err != nil {
		logger.Error("failed to delete user", err, zap.Uint("id", id))
		return err
	}

	if audit != nil {
		description := "Deleted user: " + user.Name + " (" + user.Email + ")"
		helpers.LogActivity(audit.UserID, "delete", "user", description, audit.IPAddress, audit.UserAgent)
	}

	return nil
}

func (s *userService) UpdateRole(id uint, role string, audit *AuditContext) (*models.User, error) {
	if !isValidRole(role) {
		return nil, ErrInvalidRole
	}

	user, err := s.userRepo.FindByID(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrUserNotFound
		}
		return nil, err
	}

	oldRole := user.Role

	if err := s.userRepo.UpdateRole(id, role); err != nil {
		logger.Error("failed to update user role", err, zap.Uint("id", id))
		return nil, err
	}

	user.Role = role

	if audit != nil {
		description := "Changed role for " + user.Name + " from " + oldRole + " to " + role
		helpers.LogActivity(audit.UserID, "update_role", "user", description, audit.IPAddress, audit.UserAgent)
	}

	return user, nil
}

func (s *userService) UpdateStatus(id uint, status string, audit *AuditContext) (*models.User, error) {
	if !isValidStatus(status) {
		return nil, ErrInvalidStatus
	}

	user, err := s.userRepo.FindByID(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrUserNotFound
		}
		return nil, err
	}

	oldStatus := user.Status

	if err := s.userRepo.UpdateStatus(id, status); err != nil {
		logger.Error("failed to update user status", err, zap.Uint("id", id))
		return nil, err
	}

	user.Status = status

	if audit != nil {
		description := "Changed status for " + user.Name + " from " + oldStatus + " to " + status
		helpers.LogActivity(audit.UserID, "update_status", "user", description, audit.IPAddress, audit.UserAgent)
	}

	return user, nil
}

func isValidRole(role string) bool {
	for _, validRole := range ValidRoles {
		if role == validRole {
			return true
		}
	}
	return false
}

func isValidStatus(status string) bool {
	for _, validStatus := range ValidStatuses {
		if status == validStatus {
			return true
		}
	}
	return false
}

func formatLastLogin(lastLogin *time.Time) string {
	if lastLogin == nil {
		return ""
	}
	return lastLogin.Format(time.RFC3339)
}
