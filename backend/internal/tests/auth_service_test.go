package tests

import (
	"testing"

	"github.com/fiqryomaratala/backend/internal/helpers"
	"github.com/fiqryomaratala/backend/internal/mocks"
	"github.com/fiqryomaratala/backend/internal/models"
	"github.com/fiqryomaratala/backend/internal/services"
	"github.com/stretchr/testify/assert"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func TestAuthServiceRegisterSuccess(t *testing.T) {
	SetupTest(t)

	var createdUser *models.User
	userRepo := &mocks.MockUserRepository{
		FindByEmailFunc: func(email string) (*models.User, error) {
			return nil, nil
		},
		CreateFunc: func(user *models.User) error {
			user.ID = 1
			createdUser = user
			return nil
		},
	}

	service := services.NewAuthService(userRepo)
	user, err := service.Register("John Doe", "JOHN@example.com ", "password123")

	assert.NoError(t, err)
	assert.NotNil(t, user)
	assert.Equal(t, uint(1), user.ID)
	assert.Equal(t, "john@example.com", user.Email)
	assert.Equal(t, "customer", user.Role)
	assert.NotNil(t, createdUser)
	assert.NotEqual(t, "password123", createdUser.Password)
	assert.NoError(t, bcrypt.CompareHashAndPassword([]byte(createdUser.Password), []byte("password123")))
}

func TestAuthServiceRegisterDuplicateEmail(t *testing.T) {
	SetupTest(t)

	userRepo := &mocks.MockUserRepository{
		FindByEmailFunc: func(email string) (*models.User, error) {
			return &models.User{Model: gorm.Model{ID: 7}, Email: email}, nil
		},
	}

	service := services.NewAuthService(userRepo)
	user, err := service.Register("John Doe", "john@example.com", "password123")

	assert.ErrorIs(t, err, services.ErrEmailAlreadyExists)
	assert.Nil(t, user)
}

func TestAuthServiceLoginSuccess(t *testing.T) {
	SetupTest(t)

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)
	assert.NoError(t, err)

	userRepo := &mocks.MockUserRepository{
		FindByEmailFunc: func(email string) (*models.User, error) {
			return &models.User{
				Model:    models.User{}.Model,
				Password: string(hashedPassword),
				Name:     "John Doe",
				Email:    "john@example.com",
				Role:     "customer",
			}, nil
		},
	}

	service := services.NewAuthService(userRepo)
	result, err := service.Login("john@example.com", "password123", nil)

	assert.NoError(t, err)
	assert.NotNil(t, result)
	assert.NotEmpty(t, result.Token)
	assert.NotNil(t, result.User)
	assert.Equal(t, "john@example.com", result.User.Email)
}

func TestAuthServiceLoginWrongPassword(t *testing.T) {
	SetupTest(t)

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)
	assert.NoError(t, err)

	userRepo := &mocks.MockUserRepository{
		FindByEmailFunc: func(email string) (*models.User, error) {
			return &models.User{
				Email:    email,
				Password: string(hashedPassword),
				Role:     "customer",
			}, nil
		},
	}

	service := services.NewAuthService(userRepo)
	result, err := service.Login("john@example.com", "wrong-password", nil)

	assert.ErrorIs(t, err, services.ErrInvalidCredentials)
	assert.Nil(t, result)
}

func TestAuthServiceLoginEmailNotFound(t *testing.T) {
	SetupTest(t)

	userRepo := &mocks.MockUserRepository{
		FindByEmailFunc: func(email string) (*models.User, error) {
			return nil, nil
		},
	}

	service := services.NewAuthService(userRepo)
	result, err := service.Login("missing@example.com", "password123", nil)

	assert.ErrorIs(t, err, services.ErrInvalidCredentials)
	assert.Nil(t, result)
}

func TestGenerateJWT(t *testing.T) {
	SetupTest(t)

	token, err := helpers.GenerateToken(10, "john@example.com", "customer")

	assert.NoError(t, err)
	assert.NotEmpty(t, token)

	claims, err := helpers.ValidateToken(token)
	assert.NoError(t, err)
	assert.NotNil(t, claims)
	assert.Equal(t, uint(10), claims.UserID)
	assert.Equal(t, "john@example.com", claims.Email)
	assert.Equal(t, "customer", claims.Role)
}

func TestAuthServiceUpdateProfilePhoto(t *testing.T) {
	SetupTest(t)

	var updatedUser *models.User
	userRepo := &mocks.MockUserRepository{
		FindByIDFunc: func(id uint) (*models.User, error) {
			return &models.User{
				Model:    gorm.Model{ID: id},
				Name:     "John Doe",
				Email:    "john@example.com",
				PhotoURL: "/uploads/profile/old.png",
				Role:     "customer",
			}, nil
		},
		UpdateFunc: func(user *models.User) error {
			updatedUser = user
			return nil
		},
	}

	service := services.NewAuthService(userRepo)
	user, err := service.UpdateProfilePhoto(10, "/uploads/profile/customer_10_123.png", nil)

	assert.NoError(t, err)
	assert.NotNil(t, user)
	assert.Equal(t, "/uploads/profile/customer_10_123.png", user.PhotoURL)
	assert.NotNil(t, updatedUser)
	assert.Equal(t, "/uploads/profile/customer_10_123.png", updatedUser.PhotoURL)
}
