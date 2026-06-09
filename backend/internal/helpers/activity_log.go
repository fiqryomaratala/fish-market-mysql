package helpers

import (
	"strings"

	"github.com/fiqryomaratala/backend/internal/models"
	"github.com/fiqryomaratala/backend/internal/repositories"
	"gorm.io/gorm"
)

var activityLogRepo repositories.ActivityLogRepository

func InitActivityLogger(db *gorm.DB) {
	activityLogRepo = repositories.NewActivityLogRepository(db)
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

	_ = activityLogRepo.Create(log)
}
