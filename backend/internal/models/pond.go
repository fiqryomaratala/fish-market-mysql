package models

import "gorm.io/gorm"

type Pond struct {
	gorm.Model

	Name        string `gorm:"not null"`
	Location    string
	Capacity    int
	Area        float64
	WaterType   string
	Status      string `gorm:"default:active"`
	Description string
}
