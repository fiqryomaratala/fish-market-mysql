import api from '@/api/axios'
import type {
  OrderItem,
  OrderDetail,
  OrderListItem,
  OrdersQueryParams,
  OrdersResponse,
  UpdateOrderStatusPayload,
} from '@/types/order-management'

type OrderItemApiRecord = {
  id?: number
  product?: string
  quantity?: number
  price?: number
  subtotal?: number
}

type OrderApiRecord = {
  id?: number
  invoice_number?: string
  customer?: string
  total_price?: number
  status?: string
  payment_status?: string
  shipping_address?: string
  created_at?: string
  items?: OrderItemApiRecord[]
}

type OrderListEnvelope = {
  data?: {
    items?: OrderApiRecord[]
    meta?: {
      page?: number
      limit?: number
      total?: number
    }
  }
}

type OrderDetailEnvelope = {
  data?: OrderApiRecord
}

function normalizeOrderItem(item: OrderItemApiRecord, fallbackId = 0): OrderItem {
  return {
    id: item.id ?? fallbackId,
    product_name: item.product ?? '-',
    batch_code: '-',
    fish_type: '-',
    quantity: Number(item.quantity ?? 0),
    price: Number(item.price ?? 0),
    subtotal: Number(item.subtotal ?? 0),
  }
}

function normalizeOrder(record: OrderApiRecord, fallbackId = 0): OrderListItem {
  return {
    id: record.id ?? fallbackId,
    invoice_number: record.invoice_number ?? `INV-${String(fallbackId).padStart(4, '0')}`,
    customer_name: record.customer ?? 'Pelanggan',
    customer_email: '',
    phone: '',
    shipping_address: record.shipping_address ?? '-',
    payment_method: record.payment_status ?? '-',
    status: record.status ?? 'pending',
    total_amount: Number(record.total_price ?? 0),
    total_items: Array.isArray(record.items)
      ? record.items.reduce((total, item) => total + Number(item.quantity ?? 0), 0)
      : 0,
    created_at: record.created_at ?? '',
    updated_at: record.created_at ?? '',
  }
}

function normalizeOrderDetail(record: OrderApiRecord, fallbackId = 0): OrderDetail {
  return {
    ...normalizeOrder(record, fallbackId),
    items: Array.isArray(record.items)
      ? record.items.map((item, index) => normalizeOrderItem(item, index + 1))
      : [],
  }
}

function buildSummary(orders: OrderListItem[]) {
  const totalRevenue = orders.reduce((total, order) => total + order.total_amount, 0)

  return {
    total_orders: orders.length,
    pending_orders: orders.filter((order) => order.status === 'pending').length,
    processing_orders: orders.filter((order) => order.status === 'processing').length,
    completed_orders: orders.filter((order) => order.status === 'completed').length,
    total_revenue: totalRevenue,
    today_revenue: 0,
    month_revenue: 0,
  }
}

class OrderManagementService {
  async getOrders(params: OrdersQueryParams = {}): Promise<OrdersResponse> {
    const { data } = await api.get<OrderListEnvelope>('/orders', { params })
    const rawItems = data.data?.items ?? []
    const orders = rawItems.map((item, index) => normalizeOrder(item, index + 1))
    const page = data.data?.meta?.page ?? params.page ?? 1
    const limit = data.data?.meta?.limit ?? params.limit ?? 10
    const total = data.data?.meta?.total ?? orders.length

    return {
      orders,
      summary: buildSummary(orders),
      meta: {
        page,
        limit,
        total,
        total_pages: Math.max(1, Math.ceil(total / limit)),
      },
    }
  }

  async getOrderById(id: number): Promise<OrderDetail> {
    const { data } = await api.get<OrderDetailEnvelope>(`/orders/${id}`)

    if (!data.data) {
      throw new Error('Data pesanan tidak ditemukan')
    }

    return normalizeOrderDetail(data.data, id)
  }

  async updateOrderStatus(
    id: number,
    payload: UpdateOrderStatusPayload
  ): Promise<OrderDetail> {
    const { data } = await api.put<OrderDetailEnvelope>(
      `/orders/${id}/status`,
      payload
    )

    if (!data.data) {
      throw new Error('Respons ubah status pesanan tidak valid')
    }

    return normalizeOrderDetail(data.data, id)
  }
}

export const orderManagementService = new OrderManagementService()
