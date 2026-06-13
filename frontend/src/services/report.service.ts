import api from '@/api/axios'
import type {
  ApiListResponse,
  ApiResponse,
  ListQueryParams,
  ReportPayload,
  ReportRecord,
} from '@/types/api'

class ReportService {
  async getAll(params?: ListQueryParams) {
    const { data } = await api.get<ApiListResponse<ReportRecord>>('/reports', { params })
    return data
  }

  async getById(id: string) {
    const { data } = await api.get<ApiResponse<ReportRecord>>(`/reports/${id}`)
    return data
  }

  async generate(payload: ReportPayload) {
    const { data } = await api.post<ApiResponse<ReportRecord>>('/reports/generate', payload)
    return data
  }

  async exportById(id: string) {
    const { data } = await api.get<Blob>(`/reports/${id}/export`, {
      responseType: 'blob',
    })
    return data
  }
}

export const reportService = new ReportService()
