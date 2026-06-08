package models

import "gorm.io/gorm"

type Product struct {
	gorm.Model

	Name        string  `gorm:"not null"`
	Description string  `gorm:"type:text"`
	Price       float64 `gorm:"not null"`
	Stock       int     `gorm:"default:0"`
	Category    string
	ImageURL    string
	Status      string `gorm:"default:active"`
}
