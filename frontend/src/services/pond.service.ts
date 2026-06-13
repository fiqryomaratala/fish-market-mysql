import api from '@/api/axios'
import type {
  ApiListResponse,
  ApiResponse,
  ListQueryParams,
  Pond,
  PondPayload,
} from '@/types/api'

class PondService {
  async getAll(params?: ListQueryParams) {
    const { data } = await api.get<ApiListResponse<Pond>>('/ponds', { params })
    return data
  }

  async getById(id: string) {
    const { data } = await api.get<ApiResponse<Pond>>(`/ponds/${id}`)
    return data
  }

  async create(payload: PondPayload) {
    const { data } = await api.post<ApiResponse<Pond>>('/ponds', payload)
    return data
  }

  async update(id: string, payload: Partial<PondPayload>) {
    const { data } = await api.put<ApiResponse<Pond>>(`/ponds/${id}`, payload)
    return data
  }

  async remove(id: string) {
    const { data } = await api.delete<ApiResponse<null>>(`/ponds/${id}`)
    return data
  }
}

export const pondService = new PondService()
