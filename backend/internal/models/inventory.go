package models

import "gorm.io/gorm"

type Inventory struct {
	gorm.Model

	ProductID   uint
	FishBatchID uint
	Quantity    float64
	Unit        string
	Status      string

	Product   Product
	FishBatch FishBatch
}
