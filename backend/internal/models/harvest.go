package models

import (
	"time"

	"gorm.io/gorm"
)

type Harvest struct {
	gorm.Model

	FishBatchID   uint
	HarvestDate   time.Time
	TotalWeight   float64
	FishCount     int
	AverageWeight float64
	Notes         string

	FishBatch FishBatch
}
