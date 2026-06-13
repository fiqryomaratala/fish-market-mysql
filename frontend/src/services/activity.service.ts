import api from '@/api/axios'
import type {
  ActivityLog,
  ApiListResponse,
  ApiResponse,
  ListQueryParams,
} from '@/types/api'

class ActivityService {
  async getAll(params?: ListQueryParams) {
    const { data } = await api.get<ApiListResponse<ActivityLog>>('/activity-logs', {
      params,
    })
    return data
  }

  async getById(id: string) {
    const { data } = await api.get<ApiResponse<ActivityLog>>(`/activity-logs/${id}`)
    return data
  }
}

export const activityService = new ActivityService()
