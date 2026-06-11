package helpers

import (
	"strings"

	"github.com/fiqryomaratala/backend/internal/logger"
	"github.com/fiqryomaratala/backend/internal/models"
	"github.com/fiqryomaratala/backend/internal/repositories"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

var activityLogRepo repositories.ActivityLogRepository

func InitActivityLogger(db *gorm.DB) {
	activityLogRepo = repositories.NewActivityLogRepository(db)
	logger.Info("activity logger initialized")
}

func SetActivityLogRepository(repo repositories.ActivityLogRepository) {
	activityLogRepo = repo
}

func LogActivity(userID uint, action string, module string, description string, ip string, userAgent string) {
	if activityLogRepo == nil || userID == 0 {
		return
	}

	log := &models.ActivityLog{
		UserID:      userID,
		Action:      strings.TrimSpace(strings.ToUpper(action)),
		Module:      strings.TrimSpace(strings.ToUpper(module)),
		Description: strings.TrimSpace(description),
		IPAddress:   strings.TrimSpace(ip),
		UserAgent:   strings.TrimSpace(userAgent),
	}

	if err := activityLogRepo.Create(log); err != nil {
		logger.Error("failed to create activity log", err,
			zap.String("module", "ACTIVITY_LOG"),
			zap.Uint("user_id", userID),
			zap.String("action", log.Action),
		)
		return
	}

	logger.Info("activity log created",
		zap.String("module", "ACTIVITY_LOG"),
		zap.Uint("user_id", userID),
		zap.String("action", log.Action),
	)
}
