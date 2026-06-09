package repositories

import (
	"errors"
	"strings"

	"github.com/fiqryomaratala/backend/internal/models"
	"gorm.io/gorm"
)

type ActivityLogFilter struct {
	Page   int
	Limit  int
	Module string
	Action string
	UserID uint
}

type ActivityLogRepository interface {
	Create(log *models.ActivityLog) error
	FindAll(filter ActivityLogFilter) ([]models.ActivityLog, int64, error)
	FindByID(id uint) (*models.ActivityLog, error)
}

type activityLogRepository struct {
	db *gorm.DB
}

func NewActivityLogRepository(db *gorm.DB) ActivityLogRepository {
	return &activityLogRepository{db: db}
}

func (r *activityLogRepository) Create(log *models.ActivityLog) error {
	return r.db.Create(log).Error
}

func (r *activityLogRepository) FindAll(filter ActivityLogFilter) ([]models.ActivityLog, int64, error) {
	var (
		logs  []models.ActivityLog
		total int64
	)

	query := r.db.Model(&models.ActivityLog{}).Preload("User")

	if strings.TrimSpace(filter.Module) != "" {
		query = query.Where("module = ?", strings.TrimSpace(filter.Module))
	}
	if strings.TrimSpace(filter.Action) != "" {
		query = query.Where("action = ?", strings.TrimSpace(filter.Action))
	}
	if filter.UserID > 0 {
		query = query.Where("user_id = ?", filter.UserID)
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	offset := (filter.Page - 1) * filter.Limit
	if err := query.Order("created_at DESC").Offset(offset).Limit(filter.Limit).Find(&logs).Error; err != nil {
		return nil, 0, err
	}

	return logs, total, nil
}

func (r *activityLogRepository) FindByID(id uint) (*models.ActivityLog, error) {
	var log models.ActivityLog
	err := r.db.Preload("User").First(&log, id).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}

	return &log, nil
}
