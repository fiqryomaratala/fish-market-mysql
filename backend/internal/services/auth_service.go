package services

import (
	"errors"
	"strings"

	"github.com/fiqryomaratala/backend/internal/helpers"
	"github.com/fiqryomaratala/backend/internal/logger"
	"github.com/fiqryomaratala/backend/internal/models"
	"github.com/fiqryomaratala/backend/internal/repositories"
	"go.uber.org/zap"
	"golang.org/x/crypto/bcrypt"
)

var ErrEmailAlreadyExists = errors.New("email already exists")
var ErrInvalidCredentials = errors.New("invalid email or password")
var ErrUserNotFound = errors.New("user not found")

type LoginResult struct {
	Token string
	User  *models.User
}

type AuthService interface {
	Register(name, email, password string) (*models.User, error)
	Login(email, password string, audit *AuditContext) (*LoginResult, error)
	GetProfile(userID uint) (*models.User, error)
	UpdateProfile(userID uint, name, phone, address string, audit *AuditContext) (*models.User, error)
	UpdateProfilePhoto(userID uint, photoURL string, audit *AuditContext) (*models.User, error)
}

type authService struct {
	userRepo repositories.UserRepository
}

func NewAuthService(userRepo repositories.UserRepository) AuthService {
	return &authService{userRepo: userRepo}
}

func (s *authService) Register(name, email, password string) (*models.User, error) {
	email = strings.TrimSpace(strings.ToLower(email))
	name = strings.TrimSpace(name)
	logger.Info("register attempt", zap.String("module", "AUTH"), zap.String("email", email))

	existing, err := s.userRepo.FindByEmail(email)
	if err != nil {
		logger.Error("failed to find user by email during register", err, zap.String("module", "AUTH"), zap.String("email", email))
		return nil, err
	}
	if existing != nil {
		logger.Warn("register rejected because email already exists", zap.String("module", "AUTH"), zap.String("email", email))
		return nil, ErrEmailAlreadyExists
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		logger.Error("failed to hash password during register", err, zap.String("module", "AUTH"))
		return nil, err
	}

	user := &models.User{
		Name:     name,
		Email:    email,
		Password: string(hashedPassword),
		Role:     "customer",
	}

	if err := s.userRepo.Create(user); err != nil {
		logger.Error("failed to create user during register", err, zap.String("module", "AUTH"), zap.String("email", email))
		return nil, err
	}

	logger.Info("register successful", zap.String("module", "AUTH"), zap.Uint("user_id", user.ID), zap.String("email", user.Email))

	return user, nil
}

func (s *authService) Login(email, password string, audit *AuditContext) (*LoginResult, error) {
	email = strings.TrimSpace(strings.ToLower(email))
	logger.Info("login attempt", zap.String("module", "AUTH"), zap.String("email", email))

	user, err := s.userRepo.FindByEmail(email)
	if err != nil {
		logger.Error("failed to find user by email during login", err, zap.String("module", "AUTH"), zap.String("email", email))
		return nil, err
	}
	if user == nil {
		logger.Warn("login failed because user was not found", zap.String("module", "AUTH"), zap.String("email", email))
		return nil, ErrInvalidCredentials
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		logger.Warn("login failed because password did not match", zap.String("module", "AUTH"), zap.Uint("user_id", user.ID))
		return nil, ErrInvalidCredentials
	}

	token, err := helpers.GenerateToken(user.ID, user.Email, user.Role)
	if err != nil {
		logger.Error("failed to generate token during login", err, zap.String("module", "AUTH"), zap.Uint("user_id", user.ID))
		return nil, err
	}

	if audit != nil {
		userID := audit.UserID
		if userID == 0 {
			userID = user.ID
		}
		helpers.LogActivity(
			userID,
			"LOGIN",
			"AUTH",
			"User login berhasil",
			audit.IPAddress,
			audit.UserAgent,
		)
	}

	logger.Info("login successful", zap.String("module", "AUTH"), zap.Uint("user_id", user.ID), zap.String("role", user.Role))

	return &LoginResult{
		Token: token,
		User:  user,
	}, nil
}

func (s *authService) GetProfile(userID uint) (*models.User, error) {
	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		return nil, err
	}
	if user == nil {
		return nil, ErrUserNotFound
	}

	return user, nil
}

func (s *authService) UpdateProfile(userID uint, name, phone, address string, audit *AuditContext) (*models.User, error) {
	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		logger.Error("failed to find user before profile update", err, zap.String("module", "AUTH"), zap.Uint("user_id", userID))
		return nil, err
	}
	if user == nil {
		return nil, ErrUserNotFound
	}

	user.Name = strings.TrimSpace(name)
	user.Phone = strings.TrimSpace(phone)
	user.Address = strings.TrimSpace(address)

	if err := s.userRepo.Update(user); err != nil {
		logger.Error("failed to update profile", err, zap.String("module", "AUTH"), zap.Uint("user_id", userID))
		return nil, err
	}

	if audit != nil {
		helpers.LogActivity(audit.UserID, "UPDATE", "PROFILE", "Memperbarui data profil", audit.IPAddress, audit.UserAgent)
	}

	logger.Info("profile updated", zap.String("module", "AUTH"), zap.Uint("user_id", user.ID))

	return user, nil
}

func (s *authService) UpdateProfilePhoto(userID uint, photoURL string, audit *AuditContext) (*models.User, error) {
	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		logger.Error("failed to find user before profile photo update", err, zap.String("module", "AUTH"), zap.Uint("user_id", userID))
		return nil, err
	}
	if user == nil {
		return nil, ErrUserNotFound
	}

	oldPhotoURL := user.PhotoURL
	user.PhotoURL = strings.TrimSpace(photoURL)

	if err := s.userRepo.Update(user); err != nil {
		logger.Error("failed to update profile photo", err, zap.String("module", "AUTH"), zap.Uint("user_id", userID))
		return nil, err
	}

	if oldPhotoURL != "" && oldPhotoURL != user.PhotoURL {
		_ = helpers.DeleteUploadedFile(oldPhotoURL)
	}

	if audit != nil {
		helpers.LogActivity(audit.UserID, "UPDATE", "PROFILE", "Memperbarui foto profil", audit.IPAddress, audit.UserAgent)
	}

	logger.Info("profile photo updated", zap.String("module", "AUTH"), zap.Uint("user_id", user.ID))

	return user, nil
}
