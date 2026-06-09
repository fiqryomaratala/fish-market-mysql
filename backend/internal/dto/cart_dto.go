package dto

type CartProductItem struct {
	ID    uint    `json:"id"`
	Name  string  `json:"name"`
	Price float64 `json:"price"`
}

type CartItem struct {
	ID       uint            `json:"id"`
	Product  CartProductItem `json:"product"`
	Quantity int             `json:"quantity"`
	Subtotal float64         `json:"subtotal"`
}

type CartResponse struct {
	Items      []CartItem `json:"items"`
	TotalPrice float64    `json:"total_price"`
}
