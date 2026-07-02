export interface OrderItem {
  id: number
  product_name: string
  batch_code: string
  fish_type: string
  quantity: number
  price: number
  subtotal: number
}

export interface OrderDetail {
  id: number
  invoice_number: string
  customer_name: string
  customer_email: string
  phone: string
  shipping_address: string
  payment_method: string
  status: string
  total_amount: number
  total_items: number
  created_at: string
  updated_at: string
  items: OrderItem[]
}

export interface OrderListItem {
  id: number
  invoice_number: string
  customer_name: string
  customer_email: string
  phone: string
  shipping_address: string
  payment_method: string
  status: string
  total_amount: number
  total_items: number
  created_at: string
  updated_at: string
}

export interface OrderSummary {
  total_orders: number
  pending_orders: number
  processing_orders: number
  completed_orders: number
  total_revenue: number
  today_revenue: number
  month_revenue: number
}

export interface OrdersQueryParams {
  page?: number
  limit?: number
  search?: string
  status?: string
  date_from?: string
  date_to?: string
}

export interface OrdersMeta {
  page: number
  limit: number
  total: number
  total_pages: number
}

export interface OrdersResponse {
  orders: OrderListItem[]
  summary: OrderSummary
  meta: OrdersMeta
}

export interface UpdateOrderStatusPayload {
  status: string
}

export type OrderStatus = 
  | 'Pending'
  | 'Paid'
  | 'Processing'
  | 'Shipping'
  | 'Completed'
  | 'Cancelled'

export const ORDER_STATUS_OPTIONS: OrderStatus[] = [
  'Pending',
  'Paid',
  'Processing',
  'Shipping',
  'Completed',
  'Cancelled',
]

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  Pending: 'yellow',
  Paid: 'blue',
  Processing: 'purple',
  Shipping: 'orange',
  Completed: 'green',
  Cancelled: 'red',
}
