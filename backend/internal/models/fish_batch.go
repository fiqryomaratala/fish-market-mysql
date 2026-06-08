package models

import (
	"time"

	"gorm.io/gorm"
)

type FishBatch struct {
	gorm.Model

	BatchCode       string `gorm:"unique"`
	PondID          uint
	FishType        string
	SeedCount       int
	CurrentCount    int
	AverageWeight   float64
	StartDate       time.Time
	ExpectedHarvest time.Time
	Status          string

	Pond Pond
}
