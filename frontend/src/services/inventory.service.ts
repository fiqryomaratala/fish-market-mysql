import api from '@/api/axios'
import type {
  ApiListResponse,
  ApiResponse,
  InventoryItem,
  InventoryPayload,
  ListQueryParams,
} from '@/types/api'

class InventoryService {
  async getAll(params?: ListQueryParams) {
    const { data } = await api.get<ApiListResponse<InventoryItem>>('/inventory', { params })
    return data
  }

  async getById(id: string) {
    const { data } = await api.get<ApiResponse<InventoryItem>>(`/inventory/${id}`)
    return data
  }

  async create(payload: InventoryPayload) {
    const { data } = await api.post<ApiResponse<InventoryItem>>('/inventory', payload)
    return data
  }

  async update(id: string, payload: Partial<InventoryPayload>) {
    const { data } = await api.put<ApiResponse<InventoryItem>>(`/inventory/${id}`, payload)
    return data
  }

  async remove(id: string) {
    const { data } = await api.delete<ApiResponse<null>>(`/inventory/${id}`)
    return data
  }
}

export const inventoryService = new InventoryService()
