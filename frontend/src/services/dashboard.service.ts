import api from '@/api/axios'
import type { ApiResponse } from '@/types/api'
import type { DashboardSummary } from '@/types/dashboard'
import type { Order } from '@/types/order'

class DashboardService {
  async getSummary(): Promise<DashboardSummary> {
    const { data } = await api.get<
      ApiResponse<{
        items?: Array<{
          id?: number
          invoice_number?: string
          total_price?: number
          status?: string
          payment_status?: string
          shipping_address?: string
          created_at?: string
          customer?: string
          items?: Array<{ id?: number }>
        }>
      }>
    >('/orders', {
      params: {
        page: 1,
        limit: 100,
      },
    })

    const items = Array.isArray(data.data?.items) ? data.data.items : []

    const orders: Order[] = items.map((item, index) => ({
      id: Number(item.id ?? index + 1),
      invoice_number: typeof item.invoice_number === 'string' ? item.invoice_number : `INV-${index + 1}`,
      status:
        typeof item.status === 'string' && item.status.trim().toLowerCase() === 'pending' &&
        typeof item.payment_status === 'string' &&
        item.payment_status.trim().toLowerCase() === 'paid'
          ? 'Paid'
          : typeof item.status === 'string'
            ? item.status.charAt(0).toUpperCase() + item.status.slice(1).toLowerCase()
            : 'Pending',
      total: Number(item.total_price ?? 0),
      total_item: Array.isArray(item.items) ? item.items.length : 0,
      payment_method: '',
      shipping_name: '',
      shipping_address: typeof item.shipping_address === 'string' ? item.shipping_address : '',
      created_at: typeof item.created_at === 'string' ? item.created_at : '',
    }))

    return {
      total_orders: orders.length,
      completed_orders: orders.filter((order) => order.status === 'Completed').length,
      pending_orders: orders.filter(
        (order) =>
          order.status === 'Pending' ||
          order.status === 'Paid' ||
          order.status === 'Processing' ||
          order.status === 'Shipping',
      ).length,
      total_spending: orders.reduce((total, order) => total + order.total, 0),
    }
  }
}

export const dashboardService = new DashboardService()
