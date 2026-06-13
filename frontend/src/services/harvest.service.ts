import api from '@/api/axios'
import type {
  ApiListResponse,
  ApiResponse,
  HarvestPayload,
  HarvestRecord,
  ListQueryParams,
} from '@/types/api'

class HarvestService {
  async getAll(params?: ListQueryParams) {
    const { data } = await api.get<ApiListResponse<HarvestRecord>>('/harvest', { params })
    return data
  }

  async getById(id: string) {
    const { data } = await api.get<ApiResponse<HarvestRecord>>(`/harvest/${id}`)
    return data
  }

  async create(payload: HarvestPayload) {
    const { data } = await api.post<ApiResponse<HarvestRecord>>('/harvest', payload)
    return data
  }

  async update(id: string, payload: Partial<HarvestPayload>) {
    const { data } = await api.put<ApiResponse<HarvestRecord>>(`/harvest/${id}`, payload)
    return data
  }

  async remove(id: string) {
    const { data } = await api.delete<ApiResponse<null>>(`/harvest/${id}`)
    return data
  }
}

export const harvestService = new HarvestService()
