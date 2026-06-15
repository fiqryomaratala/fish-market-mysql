import api from '@/api/axios'
import type { ApiResponse, Order as ApiOrder, OrderPayload, OrderStatusPayload } from '@/types/api'
import type { Order, OrdersQueryParams, OrdersResult } from '@/types/order'

type OrderApiItem = {
  id?: number
  invoice_number?: string
  total_price?: number
  status?: string
  payment_status?: string
  shipping_address?: string
  created_at?: string
  customer?: string
  items?: Array<{
    id?: number
  }>
}

type OrderListEnvelope = {
  data?: {
    items?: OrderApiItem[]
    meta?: {
      page?: number
      limit?: number
      total?: number
    }
  }
  message?: string
}

function toNumber(value: unknown, fallback = 0) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function toStringValue(value: unknown, fallback = '') {
  return typeof value === 'string' ? value : fallback
}

function toTitleCase(value: string) {
  if (!value) {
    return ''
  }

  return value
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase())
    .join(' ')
}

function extractPaymentMethod(shippingAddress: string) {
  const matchedMethod = shippingAddress.match(/Metode pembayaran:\s*([^,]+)/i)
  return matchedMethod?.[1]?.trim() ?? 'Not specified'
}

function extractShippingName(shippingAddress: string, customer: string) {
  const firstSegment = shippingAddress
    .split(',')
    .map((segment) => segment.trim())
    .find(Boolean)

  return firstSegment ?? customer ?? 'Customer'
}

function normalizeStatus(status: string, paymentStatus: string) {
  const normalizedStatus = status.trim().toLowerCase()
  const normalizedPayment = paymentStatus.trim().toLowerCase()

  if (normalizedStatus === 'pending' && normalizedPayment === 'paid') {
    return 'Paid'
  }

  return toTitleCase(normalizedStatus || 'pending')
}

function mapOrder(record: OrderApiItem, fallbackId: number): Order {
  const shippingAddress = toStringValue(record.shipping_address)
  const customer = toStringValue(record.customer, 'Customer')
  const paymentStatus = toStringValue(record.payment_status)

  return {
    id: toNumber(record.id, fallbackId),
    invoice_number: toStringValue(record.invoice_number, `INV-${fallbackId}`),
    status: normalizeStatus(toStringValue(record.status, 'pending'), paymentStatus),
    total: toNumber(record.total_price),
    total_item: Array.isArray(record.items) ? record.items.length : 0,
    payment_method: toTitleCase(extractPaymentMethod(shippingAddress)),
    shipping_name: extractShippingName(shippingAddress, customer),
    shipping_address: shippingAddress,
    created_at: toStringValue(record.created_at),
  }
}

class OrderService {
  async getOrders(params: OrdersQueryParams = {}): Promise<OrdersResult> {
    const { data } = await api.get<OrderListEnvelope>('/orders', {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 100,
      },
    })

    const items = Array.isArray(data.data?.items) ? data.data.items : []
    const meta = data.data?.meta

    return {
      orders: items.map((item, index) => mapOrder(item, index + 1)),
      meta: {
        page: toNumber(meta?.page, params.page ?? 1),
        limit: toNumber(meta?.limit, params.limit ?? 100),
        total: toNumber(meta?.total, items.length),
      },
    }
  }

  async getAll(params?: OrdersQueryParams) {
    const result = await this.getOrders(params)

    return {
      data: result.orders,
      message: 'Orders fetched successfully',
      meta: result.meta,
    }
  }

  async getById(id: string) {
    const { data } = await api.get<ApiResponse<ApiOrder>>(`/orders/${id}`)
    return data
  }

  async create(payload: OrderPayload) {
    const { data } = await api.post<ApiResponse<ApiOrder>>('/orders', payload)
    return data
  }

  async updateStatus(id: string, payload: OrderStatusPayload) {
    const { data } = await api.put<ApiResponse<ApiOrder>>(`/orders/${id}/status`, payload)
    return data
  }

  async remove(id: string) {
    const { data } = await api.delete<ApiResponse<null>>(`/orders/${id}`)
    return data
  }
}

export const orderService = new OrderService()
