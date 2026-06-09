package models

import "gorm.io/gorm"

type InventoryTransaction struct {
	gorm.Model

	InventoryID uint
	Type        string
	Quantity    float64
	Description string
	Reference   string
	Inventory   Inventory
}
