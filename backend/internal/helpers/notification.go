package helpers

import (
	"strings"

	"github.com/fiqryomaratala/backend/internal/logger"
	"github.com/fiqryomaratala/backend/internal/models"
	"github.com/fiqryomaratala/backend/internal/repositories"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

var notificationRepo repositories.NotificationRepository

func InitNotificationCenter(db *gorm.DB) {
	notificationRepo = repositories.NewNotificationRepository(db)
	logger.Info("notification center initialized")
}

func SetNotificationRepository(repo repositories.NotificationRepository) {
	notificationRepo = repo
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

	if err := notificationRepo.Create(notification); err != nil {
		logger.Error("failed to create notification", err,
			zap.String("module", "NOTIFICATION"),
			zap.Uint("user_id", userID),
			zap.String("type", notification.Type),
		)
		return
	}

	logger.Info("notification created",
		zap.String("module", "NOTIFICATION"),
		zap.Uint("user_id", userID),
		zap.String("type", notification.Type),
	)
}
