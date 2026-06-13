import api from '@/api/axios'
import type {
  ApiListResponse,
  ApiResponse,
  FishBatch,
  FishBatchPayload,
  ListQueryParams,
} from '@/types/api'

class FishBatchService {
  async getAll(params?: ListQueryParams) {
    const { data } = await api.get<ApiListResponse<FishBatch>>('/fish-batches', {
      params,
    })
    return data
  }

  async getById(id: string) {
    const { data } = await api.get<ApiResponse<FishBatch>>(`/fish-batches/${id}`)
    return data
  }

  async create(payload: FishBatchPayload) {
    const { data } = await api.post<ApiResponse<FishBatch>>('/fish-batches', payload)
    return data
  }

  async update(id: string, payload: Partial<FishBatchPayload>) {
    const { data } = await api.put<ApiResponse<FishBatch>>(`/fish-batches/${id}`, payload)
    return data
  }

  async remove(id: string) {
    const { data } = await api.delete<ApiResponse<null>>(`/fish-batches/${id}`)
    return data
  }
}

export const fishBatchService = new FishBatchService()
