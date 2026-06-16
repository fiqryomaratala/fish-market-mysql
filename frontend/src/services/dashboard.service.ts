import api from '@/api/axios'
import type { ApiResponse } from '@/types/api'
import type {
  ActivityLogItem,
  AdminDashboardSummaryResponse,
  CustomerDashboardSummary,
  HarvestChartResponse,
  InventoryAlertItem,
  LatestOrderItem,
  SalesChartResponse,
} from '@/types/dashboard'
import type { Order } from '@/types/order'

type OrderApiItem = {
  id?: number
  invoice_number?: string
  total_price?: number
  status?: string
  payment_status?: string
  shipping_address?: string
  created_at?: string
  customer?: string
  items?: Array<{ id?: number }>
}

type OrdersEnvelope = {
  data?: {
    items?: OrderApiItem[]
  }
}

function toNumber(value: unknown, fallback = 0) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function toStringValue(value: unknown, fallback = '') {
  return typeof value === 'string' ? value : fallback
}

function normalizeStatus(status: string, paymentStatus: string) {
  const normalizedStatus = status.trim().toLowerCase()
  const normalizedPayment = paymentStatus.trim().toLowerCase()

  if (normalizedStatus === 'pending' && normalizedPayment === 'paid') {
    return 'Paid'
  }

  return normalizedStatus
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ')
}

function mapOrder(record: OrderApiItem, fallbackId: number): Order {
  return {
    id: toNumber(record.id, fallbackId),
    invoice_number: toStringValue(record.invoice_number, `INV-${fallbackId}`),
    status: normalizeStatus(
      toStringValue(record.status, 'pending'),
      toStringValue(record.payment_status),
    ),
    total: toNumber(record.total_price),
    total_item: Array.isArray(record.items) ? record.items.length : 0,
    payment_method: '',
    shipping_name: toStringValue(record.customer, 'Customer'),
    shipping_address: toStringValue(record.shipping_address),
    created_at: toStringValue(record.created_at),
  }
}

class DashboardService {
  async getCustomerSummary(): Promise<CustomerDashboardSummary> {
    const { data } = await api.get<OrdersEnvelope>('/orders', {
      params: {
        page: 1,
        limit: 100,
      },
    })

    const items = Array.isArray(data.data?.items) ? data.data.items : []
    const orders = items.map((item, index) => mapOrder(item, index + 1))

    return {
      total_orders: orders.length,
      completed_orders: orders.filter((order) => order.status === 'Completed').length,
      pending_orders: orders.filter((order) =>
        ['Pending', 'Paid', 'Processing', 'Shipping'].includes(order.status),
      ).length,
      total_spending: orders.reduce((total, order) => total + order.total, 0),
    }
  }

  async getSummary() {
    const { data } = await api.get<ApiResponse<AdminDashboardSummaryResponse>>(
      '/dashboard/summary',
    )
    return data.data
  }

  async getSales() {
    const { data } = await api.get<ApiResponse<SalesChartResponse>>('/dashboard/sales')
    return data.data
  }

  async getHarvest() {
    const { data } = await api.get<ApiResponse<HarvestChartResponse>>('/dashboard/harvest')
    return data.data
  }

  async getLatestOrders() {
    const { data } = await api.get<ApiResponse<LatestOrderItem[]>>('/dashboard/orders/latest')
    return data.data
  }

  async getInventoryAlerts() {
    const { data } = await api.get<ApiResponse<InventoryAlertItem[]>>(
      '/dashboard/inventory-alert',
    )
    return data.data
  }

  async getActivityLog() {
    const { data } = await api.get<ApiResponse<ActivityLogItem[]>>('/dashboard/activity')
    return data.data
  }
}

export const dashboardService = new DashboardService()
