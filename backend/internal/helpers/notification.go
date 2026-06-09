package helpers

import (
	"strings"

	"github.com/fiqryomaratala/backend/internal/models"
	"github.com/fiqryomaratala/backend/internal/repositories"
	"gorm.io/gorm"
)

var notificationRepo repositories.NotificationRepository

func InitNotificationCenter(db *gorm.DB) {
	notificationRepo = repositories.NewNotificationRepository(db)
}

func CreateNotification(
	userID uint,
	title string,
	message string,
	notificationType string,
	referenceType string,
	referenceID uint,
) {
	if notificationRepo == nil || userID == 0 {
		return
	}

	notification := &models.Notification{
		UserID:        userID,
		Title:         strings.TrimSpace(title),
		Message:       strings.TrimSpace(message),
		Type:          strings.TrimSpace(strings.ToUpper(notificationType)),
		ReferenceType: strings.TrimSpace(strings.ToUpper(referenceType)),
		ReferenceID:   referenceID,
		IsRead:        false,
	}

	_ = notificationRepo.Create(notification)
}
