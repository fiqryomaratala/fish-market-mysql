package models

import "gorm.io/gorm"

type User struct {
	gorm.Model

	Name     string `gorm:"not null"`
	Email    string `gorm:"unique;not null"`
	Password string `gorm:"not null"`
	Phone    string `gorm:"column:phone" json:"phone"`
	Address  string `gorm:"column:address" json:"address"`
	PhotoURL string `gorm:"column:photo_url" json:"photo_url"`
	Role     string `gorm:"default:customer"`
}
