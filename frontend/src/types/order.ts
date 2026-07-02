export interface Order {
  id: number
  invoice_number: string
  status: string
  total: number
  total_item: number
  payment_method: string
  shipping_name: string
  shipping_address: string
  created_at: string
}

export interface OrdersMeta {
  page: number
  limit: number
  total: number
}

export interface OrdersQueryParams {
  page?: number
  limit?: number
}

export interface OrdersResult {
  orders: Order[]
  meta: OrdersMeta
}
