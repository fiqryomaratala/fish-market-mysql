package dto

type OrderItemResponse struct {
	ID       uint    `json:"id"`
	Product  string  `json:"product"`
	Quantity int     `json:"quantity"`
	Price    float64 `json:"price"`
	Subtotal float64 `json:"subtotal"`
}

type OrderResponse struct {
	ID              uint                `json:"id"`
	InvoiceNumber   string              `json:"invoice_number"`
	Customer        string              `json:"customer"`
	TotalPrice      float64             `json:"total_price"`
	Status          string              `json:"status"`
	PaymentStatus   string              `json:"payment_status"`
	ShippingAddress string              `json:"shipping_address"`
	CreatedAt       string              `json:"created_at"`
	Items           []OrderItemResponse `json:"items,omitempty"`
}
