package models

import "gorm.io/gorm"

type ActivityLog struct {
	gorm.Model

	UserID      uint
	Action      string
	Module      string
	Description string
	IPAddress   string
	UserAgent   string

	User User
}
