import api from '@/api/axios'
import type {
  ApiListResponse,
  ApiResponse,
  ListQueryParams,
  Order,
  OrderPayload,
  OrderStatusPayload,
} from '@/types/api'

class OrderService {
  async getAll(params?: ListQueryParams) {
    const { data } = await api.get<ApiListResponse<Order>>('/orders', { params })
    return data
  }

  async getById(id: string) {
    const { data } = await api.get<ApiResponse<Order>>(`/orders/${id}`)
    return data
  }

  async create(payload: OrderPayload) {
    const { data } = await api.post<ApiResponse<Order>>('/orders', payload)
    return data
  }

  async updateStatus(id: string, payload: OrderStatusPayload) {
    const { data } = await api.patch<ApiResponse<Order>>(`/orders/${id}/status`, payload)
    return data
  }

  async remove(id: string) {
    const { data } = await api.delete<ApiResponse<null>>(`/orders/${id}`)
    return data
  }
}

export const orderService = new OrderService()
