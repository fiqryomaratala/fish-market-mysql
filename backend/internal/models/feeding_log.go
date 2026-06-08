package models

import (
	"time"

	"gorm.io/gorm"
)

type FeedingLog struct {
	gorm.Model

	FishBatchID uint
	FeedType    string
	FeedAmount  float64
	FeedTime    time.Time
	Notes       string

	FishBatch FishBatch
}
