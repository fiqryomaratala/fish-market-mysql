package repositories

import (
	"errors"
	"time"

	"github.com/fiqryomaratala/backend/internal/models"
	"gorm.io/gorm"
)

type FeedingLogFilter struct {
	FishBatchID uint
	StartDate   *time.Time
	EndDate     *time.Time
	Page        int
	Limit       int
}

type FeedingLogRepository interface {
	Create(log *models.FeedingLog) error
	FindAll(filter FeedingLogFilter) ([]models.FeedingLog, int64, error)
	FindByID(id uint) (*models.FeedingLog, error)
	Update(log *models.FeedingLog) error
	Delete(log *models.FeedingLog) error
}

type feedingLogRepository struct {
	db *gorm.DB
}

func NewFeedingLogRepository(db *gorm.DB) FeedingLogRepository {
	return &feedingLogRepository{db: db}
}

func (r *feedingLogRepository) Create(log *models.FeedingLog) error {
	return r.db.Create(log).Error
}

func (r *feedingLogRepository) FindAll(filter FeedingLogFilter) ([]models.FeedingLog, int64, error) {
	var (
		logs  []models.FeedingLog
		total int64
	)

	query := r.db.Model(&models.FeedingLog{}).Preload("FishBatch")

	if filter.FishBatchID > 0 {
		query = query.Where("fish_batch_id = ?", filter.FishBatchID)
	}
	if filter.StartDate != nil {
		query = query.Where("feed_time >= ?", *filter.StartDate)
	}
	if filter.EndDate != nil {
		query = query.Where("feed_time <= ?", *filter.EndDate)
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	offset := (filter.Page - 1) * filter.Limit
	if err := query.Order("feed_time DESC").Offset(offset).Limit(filter.Limit).Find(&logs).Error; err != nil {
		return nil, 0, err
	}

	return logs, total, nil
}

func (r *feedingLogRepository) FindByID(id uint) (*models.FeedingLog, error) {
	var log models.FeedingLog
	err := r.db.Preload("FishBatch").First(&log, id).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}

	return &log, nil
}

func (r *feedingLogRepository) Update(log *models.FeedingLog) error {
	return r.db.Save(log).Error
}

func (r *feedingLogRepository) Delete(log *models.FeedingLog) error {
	return r.db.Delete(log).Error
}
