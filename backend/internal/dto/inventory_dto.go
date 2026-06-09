package dto

type InventoryItem struct {
	ID          uint    `json:"id"`
	ProductID   uint    `json:"product_id"`
	Product     string  `json:"product"`
	FishBatchID uint    `json:"fish_batch_id"`
	BatchCode   string  `json:"batch_code"`
	Quantity    float64 `json:"quantity"`
	Unit        string  `json:"unit"`
	Status      string  `json:"status"`
}

type InventoryTransactionItem struct {
	ID          uint    `json:"id"`
	InventoryID uint    `json:"inventory_id"`
	Type        string  `json:"type"`
	Quantity    float64 `json:"quantity"`
	Description string  `json:"description"`
	Reference   string  `json:"reference"`
	Product     string  `json:"product"`
	BatchCode   string  `json:"batch_code"`
	CreatedAt   string  `json:"created_at"`
}
