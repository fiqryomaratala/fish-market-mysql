package models

import "gorm.io/gorm"

type Notification struct {
	gorm.Model

	UserID        uint
	Title         string
	Message       string
	Type          string
	ReferenceType string
	ReferenceID   uint
	IsRead        bool

	User User
}
