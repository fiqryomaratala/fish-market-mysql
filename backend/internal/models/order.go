package models

import "gorm.io/gorm"

type Order struct {
	gorm.Model

	UserID          uint
	InvoiceNumber   string
	TotalPrice      float64
	Status          string
	PaymentStatus   string
	PaymentMethod   string
	PaymentProvider string
	PaymentLinkID   string
	PaymentLinkURL  string
	ShippingAddress string

	User       User
	OrderItems []OrderItem
}
