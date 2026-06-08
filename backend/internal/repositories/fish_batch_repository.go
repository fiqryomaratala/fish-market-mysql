package repositories

import (
	"errors"

	"github.com/fiqryomaratala/backend/internal/models"
	"gorm.io/gorm"
)

type FishBatchFilter struct {
	PondID   uint
	FishType string
	Status   string
	Page     int
	Limit    int
}

type FishBatchRepository interface {
	Create(batch *models.FishBatch) error
	FindAll(filter FishBatchFilter) ([]models.FishBatch, int64, error)
	FindByID(id uint) (*models.FishBatch, error)
	Update(batch *models.FishBatch) error
	Delete(batch *models.FishBatch) error
	CountByYear(year int) (int64, error)
}

type fishBatchRepository struct {
	db *gorm.DB
}

func NewFishBatchRepository(db *gorm.DB) FishBatchRepository {
	return &fishBatchRepository{db: db}
}

func (r *fishBatchRepository) Create(batch *models.FishBatch) error {
	return r.db.Create(batch).Error
}

func (r *fishBatchRepository) FindAll(filter FishBatchFilter) ([]models.FishBatch, int64, error) {
	var (
		batches []models.FishBatch
		total   int64
	)

	query := r.db.Model(&models.FishBatch{}).Preload("Pond")

	if filter.PondID > 0 {
		query = query.Where("pond_id = ?", filter.PondID)
	}
	if filter.FishType != "" {
		query = query.Where("fish_type = ?", filter.FishType)
	}
	if filter.Status != "" {
		query = query.Where("status = ?", filter.Status)
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	offset := (filter.Page - 1) * filter.Limit
	if err := query.Order("created_at DESC").Offset(offset).Limit(filter.Limit).Find(&batches).Error; err != nil {
		return nil, 0, err
	}

	return batches, total, nil
}

func (r *fishBatchRepository) FindByID(id uint) (*models.FishBatch, error) {
	var batch models.FishBatch
	err := r.db.Preload("Pond").First(&batch, id).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}

	return &batch, nil
}

func (r *fishBatchRepository) Update(batch *models.FishBatch) error {
	return r.db.Save(batch).Error
}

func (r *fishBatchRepository) Delete(batch *models.FishBatch) error {
	return r.db.Delete(batch).Error
}

func (r *fishBatchRepository) CountByYear(year int) (int64, error) {
	var total int64
	err := r.db.Model(&models.FishBatch{}).
		Where("YEAR(created_at) = ?", year).
		Count(&total).Error

	return total, err
}
