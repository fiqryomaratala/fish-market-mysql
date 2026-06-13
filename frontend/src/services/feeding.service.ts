import api from '@/api/axios'
import type {
  ApiListResponse,
  ApiResponse,
  FeedingPayload,
  FeedingRecord,
  ListQueryParams,
} from '@/types/api'

class FeedingService {
  async getAll(params?: ListQueryParams) {
    const { data } = await api.get<ApiListResponse<FeedingRecord>>('/feeding', { params })
    return data
  }

  async getById(id: string) {
    const { data } = await api.get<ApiResponse<FeedingRecord>>(`/feeding/${id}`)
    return data
  }

  async create(payload: FeedingPayload) {
    const { data } = await api.post<ApiResponse<FeedingRecord>>('/feeding', payload)
    return data
  }

  async update(id: string, payload: Partial<FeedingPayload>) {
    const { data } = await api.put<ApiResponse<FeedingRecord>>(`/feeding/${id}`, payload)
    return data
  }

  async remove(id: string) {
    const { data } = await api.delete<ApiResponse<null>>(`/feeding/${id}`)
    return data
  }
}

export const feedingService = new FeedingService()
