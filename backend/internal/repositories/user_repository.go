package repositories

import (
	"strings"

	"github.com/fiqryomaratala/backend/internal/models"
	"gorm.io/gorm"
)

type UserFilter struct {
	Search string
	Role   string
	Status string
	Page   int
	Limit  int
}

type UserRepository interface {
	Create(user *models.User) error
	FindAll(filter UserFilter) ([]models.User, int64, error)
	FindByID(id uint) (*models.User, error)
	FindByEmail(email string) (*models.User, error)
	Update(user *models.User) error
	Delete(user *models.User) error
	UpdateRole(id uint, role string) error
	UpdateStatus(id uint, status string) error
}

type userRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) UserRepository {
	return &userRepository{db: db}
}

func (r *userRepository) Create(user *models.User) error {
	return r.db.Create(user).Error
}

func (r *userRepository) FindAll(filter UserFilter) ([]models.User, int64, error) {
	var users []models.User
	var total int64

	query := r.db.Model(&models.User{})

	if filter.Search != "" {
		searchPattern := "%" + strings.ToLower(filter.Search) + "%"
		query = query.Where(
			"LOWER(name) LIKE ? OR LOWER(email) LIKE ? OR LOWER(phone) LIKE ?",
			searchPattern, searchPattern, searchPattern,
		)
	}

	if filter.Role != "" {
		query = query.Where("role = ?", filter.Role)
	}

	if filter.Status != "" {
		query = query.Where("status = ?", filter.Status)
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	if filter.Page > 0 && filter.Limit > 0 {
		offset := (filter.Page - 1) * filter.Limit
		query = query.Offset(offset).Limit(filter.Limit)
	}

	query = query.Order("created_at DESC")

	if err := query.Find(&users).Error; err != nil {
		return nil, 0, err
	}

	return users, total, nil
}

func (r *userRepository) FindByID(id uint) (*models.User, error) {
	var user models.User
	if err := r.db.First(&user, id).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *userRepository) FindByEmail(email string) (*models.User, error) {
	var user models.User
	if err := r.db.Where("email = ?", email).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *userRepository) Update(user *models.User) error {
	return r.db.Save(user).Error
}

func (r *userRepository) Delete(user *models.User) error {
	return r.db.Delete(user).Error
}

func (r *userRepository) UpdateRole(id uint, role string) error {
	return r.db.Model(&models.User{}).Where("id = ?", id).Update("role", role).Error
}

func (r *userRepository) UpdateStatus(id uint, status string) error {
	return r.db.Model(&models.User{}).Where("id = ?", id).Update("status", status).Error
}
