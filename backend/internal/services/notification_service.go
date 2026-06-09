package services

import (
	"errors"
	"time"

	"github.com/fiqryomaratala/backend/internal/dto"
	"github.com/fiqryomaratala/backend/internal/models"
	"github.com/fiqryomaratala/backend/internal/repositories"
)

var ErrNotificationNotFound = errors.New("notification not found")
var ErrForbiddenNotificationAccess = errors.New("forbidden notification access")

type NotificationListParams struct {
	UserID uint
	Page   int
	Limit  int
	Type   string
}

type NotificationService interface {
	GetAll(params NotificationListParams) ([]dto.NotificationItem, map[string]interface{}, error)
	GetUnread(userID uint) ([]dto.NotificationItem, error)
	MarkAsRead(id, userID uint) error
	MarkAllAsRead(userID uint) error
	Delete(id, userID uint) error
}

type notificationService struct {
	notificationRepo repositories.NotificationRepository
}

func NewNotificationService(notificationRepo repositories.NotificationRepository) NotificationService {
	return &notificationService{notificationRepo: notificationRepo}
}

func (s *notificationService) GetAll(params NotificationListParams) ([]dto.NotificationItem, map[string]interface{}, error) {
	items, total, err := s.notificationRepo.FindAll(repositories.NotificationFilter{
		UserID: params.UserID,
		Page:   params.Page,
		Limit:  params.Limit,
		Type:   params.Type,
	})
	if err != nil {
		return nil, nil, err
	}

	result := make([]dto.NotificationItem, 0, len(items))
	for _, item := range items {
		result = append(result, toNotificationDTO(&item))
	}

	return result, map[string]interface{}{
		"page":  params.Page,
		"limit": params.Limit,
		"total": total,
	}, nil
}

func (s *notificationService) GetUnread(userID uint) ([]dto.NotificationItem, error) {
	items, err := s.notificationRepo.FindUnreadByUserID(userID)
	if err != nil {
		return nil, err
	}

	result := make([]dto.NotificationItem, 0, len(items))
	for _, item := range items {
		result = append(result, toNotificationDTO(&item))
	}

	return result, nil
}

func (s *notificationService) MarkAsRead(id, userID uint) error {
	item, err := s.notificationRepo.FindByID(id)
	if err != nil {
		return err
	}
	if item == nil {
		return ErrNotificationNotFound
	}
	if item.UserID != userID {
		return ErrForbiddenNotificationAccess
	}

	item.IsRead = true
	return s.notificationRepo.Update(item)
}

func (s *notificationService) MarkAllAsRead(userID uint) error {
	return s.notificationRepo.MarkAllAsRead(userID)
}

func (s *notificationService) Delete(id, userID uint) error {
	item, err := s.notificationRepo.FindByID(id)
	if err != nil {
		return err
	}
	if item == nil {
		return ErrNotificationNotFound
	}
	if item.UserID != userID {
		return ErrForbiddenNotificationAccess
	}

	return s.notificationRepo.Delete(item)
}

func toNotificationDTO(item *models.Notification) dto.NotificationItem {
	return dto.NotificationItem{
		ID:        item.ID,
		Title:     item.Title,
		Message:   item.Message,
		Type:      item.Type,
		IsRead:    item.IsRead,
		CreatedAt: item.CreatedAt.UTC().Format(time.RFC3339),
	}
}
