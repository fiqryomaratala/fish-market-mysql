import api from '@/api/axios'
import type {
  OrderDetail,
  OrdersQueryParams,
  OrdersResponse,
  UpdateOrderStatusPayload,
} from '@/types/order-management'

class OrderManagementService {
  async getOrders(params: OrdersQueryParams = {}): Promise<OrdersResponse> {
    const { data } = await api.get<OrdersResponse>('/orders', { params })
    return data
  }

  async getOrderById(id: number): Promise<OrderDetail> {
    const { data } = await api.get<{ data: OrderDetail }>(`/orders/${id}`)
    return data.data
  }

  async updateOrderStatus(
    id: number,
    payload: UpdateOrderStatusPayload
  ): Promise<OrderDetail> {
    const { data } = await api.put<{ data: OrderDetail }>(
      `/orders/${id}/status`,
      payload
    )
    return data.data
  }
}

export const orderManagementService = new OrderManagementService()
