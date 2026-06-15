export interface CartItem {
  id: number
  product_id: number
  name: string
  price: number
  quantity: number
  stock: number
  image_url: string
  subtotal: number
  batch_code: string
  farm_name: string
}

export interface CartSummary {
  items: CartItem[]
  total_items: number
  total_price: number
}

export interface AddToCartPayload {
  product_id: number
  quantity: number
}

export interface UpdateCartPayload {
  quantity: number
}
