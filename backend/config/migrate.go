package config

import "github.com/fiqryomaratala/backend/internal/models"

func Migrate() {
	DB.AutoMigrate(
		&models.User{},
		&models.ActivityLog{},
		&models.Product{},
		&models.Pond{},
		&models.FishBatch{},
		&models.FeedingLog{},
		&models.Harvest{},
	)
}
