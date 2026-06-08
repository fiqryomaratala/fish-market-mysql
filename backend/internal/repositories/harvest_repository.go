package repositories

import (
	"errors"
	"time"

	"github.com/fiqryomaratala/backend/internal/models"
	"gorm.io/gorm"
)

type HarvestFilter struct {
	FishBatchID uint
	StartDate   *time.Time
	EndDate     *time.Time
	Page        int
	Limit       int
}

type HarvestSummary struct {
	TotalHarvests int64
	TotalWeight   float64
	TotalFish     int64
}

type HarvestRepository interface {
	Create(harvest *models.Harvest) error
	FindAll(filter HarvestFilter) ([]models.Harvest, int64, error)
	FindByID(id uint) (*models.Harvest, error)
	Update(harvest *models.Harvest) error
	Delete(harvest *models.Harvest) error
	GetSummary() (*HarvestSummary, error)
}

type harvestRepository struct {
	db *gorm.DB
}

func NewHarvestRepository(db *gorm.DB) HarvestRepository {
	return &harvestRepository{db: db}
}

func (r *harvestRepository) Create(harvest *models.Harvest) error {
	return r.db.Create(harvest).Error
}

func (r *harvestRepository) FindAll(filter HarvestFilter) ([]models.Harvest, int64, error) {
	var (
		harvests []models.Harvest
		total    int64
	)

	query := r.db.Model(&models.Harvest{}).Preload("FishBatch")

	if filter.FishBatchID > 0 {
		query = query.Where("fish_batch_id = ?", filter.FishBatchID)
	}
	if filter.StartDate != nil {
		query = query.Where("harvest_date >= ?", *filter.StartDate)
	}
	if filter.EndDate != nil {
		query = query.Where("harvest_date <= ?", *filter.EndDate)
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	offset := (filter.Page - 1) * filter.Limit
	if err := query.Order("harvest_date DESC").Offset(offset).Limit(filter.Limit).Find(&harvests).Error; err != nil {
		return nil, 0, err
	}

	return harvests, total, nil
}

func (r *harvestRepository) FindByID(id uint) (*models.Harvest, error) {
	var harvest models.Harvest
	err := r.db.Preload("FishBatch").First(&harvest, id).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}

	return &harvest, nil
}

func (r *harvestRepository) Update(harvest *models.Harvest) error {
	return r.db.Save(harvest).Error
}

func (r *harvestRepository) Delete(harvest *models.Harvest) error {
	return r.db.Delete(harvest).Error
}

func (r *harvestRepository) GetSummary() (*HarvestSummary, error) {
	var summary HarvestSummary

	err := r.db.Model(&models.Harvest{}).
		Select("COUNT(*) as total_harvests, COALESCE(SUM(total_weight), 0) as total_weight, COALESCE(SUM(fish_count), 0) as total_fish").
		Scan(&summary).Error
	if err != nil {
		return nil, err
	}

	return &summary, nil
}
