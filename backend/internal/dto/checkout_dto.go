package dto

type CheckoutResponse struct {
	OrderID       uint    `json:"order_id"`
	Invoice       string  `json:"invoice"`
	Total         float64 `json:"total"`
	Status        string  `json:"status"`
	PaymentStatus string  `json:"payment_status"`
	PaymentMethod string  `json:"payment_method"`
	PaymentURL    string  `json:"payment_url,omitempty"`
	CreatedAt     string  `json:"created_at"`
}
