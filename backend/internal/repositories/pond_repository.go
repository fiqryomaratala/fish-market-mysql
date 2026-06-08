package repositories

import (
	"errors"
	"strings"

	"github.com/fiqryomaratala/backend/internal/models"
	"gorm.io/gorm"
)

type PondFilter struct {
	Search string
	Page   int
	Limit  int
}

type PondRepository interface {
	Create(pond *models.Pond) error
	FindAll(filter PondFilter) ([]models.Pond, int64, error)
	FindByID(id uint) (*models.Pond, error)
	Update(pond *models.Pond) error
	Delete(pond *models.Pond) error
}

type pondRepository struct {
	db *gorm.DB
}

func NewPondRepository(db *gorm.DB) PondRepository {
	return &pondRepository{db: db}
}

func (r *pondRepository) Create(pond *models.Pond) error {
	return r.db.Create(pond).Error
}

func (r *pondRepository) FindAll(filter PondFilter) ([]models.Pond, int64, error) {
	var (
		ponds []models.Pond
		total int64
	)

	query := r.db.Model(&models.Pond{})
	if filter.Search != "" {
		search := "%" + strings.TrimSpace(filter.Search) + "%"
		query = query.Where("name LIKE ? OR location LIKE ? OR description LIKE ?", search, search, search)
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	offset := (filter.Page - 1) * filter.Limit
	if err := query.Order("created_at DESC").Offset(offset).Limit(filter.Limit).Find(&ponds).Error; err != nil {
		return nil, 0, err
	}

	return ponds, total, nil
}

func (r *pondRepository) FindByID(id uint) (*models.Pond, error) {
	var pond models.Pond
	err := r.db.First(&pond, id).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}

	return &pond, nil
}

func (r *pondRepository) Update(pond *models.Pond) error {
	return r.db.Save(pond).Error
}

func (r *pondRepository) Delete(pond *models.Pond) error {
	return r.db.Delete(pond).Error
}
