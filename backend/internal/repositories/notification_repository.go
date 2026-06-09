package repositories

import (
	"errors"
	"strings"

	"github.com/fiqryomaratala/backend/internal/models"
	"gorm.io/gorm"
)

type NotificationFilter struct {
	UserID uint
	Page   int
	Limit  int
	Type   string
}

type NotificationRepository interface {
	Create(notification *models.Notification) error
	FindAll(filter NotificationFilter) ([]models.Notification, int64, error)
	FindUnreadByUserID(userID uint) ([]models.Notification, error)
	FindByID(id uint) (*models.Notification, error)
	Update(notification *models.Notification) error
	MarkAllAsRead(userID uint) error
	Delete(notification *models.Notification) error
}

type notificationRepository struct {
	db *gorm.DB
}

func NewNotificationRepository(db *gorm.DB) NotificationRepository {
	return &notificationRepository{db: db}
}

func (r *notificationRepository) Create(notification *models.Notification) error {
	return r.db.Create(notification).Error
}

func (r *notificationRepository) FindAll(filter NotificationFilter) ([]models.Notification, int64, error) {
	var (
		items []models.Notification
		total int64
	)

	query := r.db.Model(&models.Notification{}).Where("user_id = ?", filter.UserID)
	if strings.TrimSpace(filter.Type) != "" {
		query = query.Where("type = ?", strings.TrimSpace(filter.Type))
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	offset := (filter.Page - 1) * filter.Limit
	if err := query.Order("created_at DESC").Offset(offset).Limit(filter.Limit).Find(&items).Error; err != nil {
		return nil, 0, err
	}

	return items, total, nil
}

func (r *notificationRepository) FindUnreadByUserID(userID uint) ([]models.Notification, error) {
	var items []models.Notification
	err := r.db.Where("user_id = ? AND is_read = ?", userID, false).Order("created_at DESC").Find(&items).Error
	return items, err
}

func (r *notificationRepository) FindByID(id uint) (*models.Notification, error) {
	var item models.Notification
	err := r.db.First(&item, id).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &item, nil
}

func (r *notificationRepository) Update(notification *models.Notification) error {
	return r.db.Save(notification).Error
}

func (r *notificationRepository) MarkAllAsRead(userID uint) error {
	return r.db.Model(&models.Notification{}).Where("user_id = ?", userID).Update("is_read", true).Error
}

func (r *notificationRepository) Delete(notification *models.Notification) error {
	return r.db.Delete(notification).Error
}
