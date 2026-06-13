import api from '@/api/axios'
import type {
  ApiListResponse,
  ApiResponse,
  AppNotification,
  ListQueryParams,
} from '@/types/api'

class NotificationService {
  async getAll(params?: ListQueryParams) {
    const { data } = await api.get<ApiListResponse<AppNotification>>('/notifications', {
      params,
    })
    return data
  }

  async getById(id: string) {
    const { data } = await api.get<ApiResponse<AppNotification>>(`/notifications/${id}`)
    return data
  }

  async markAsRead(id: string) {
    const { data } = await api.patch<ApiResponse<AppNotification>>(
      `/notifications/${id}/read`,
    )
    return data
  }

  async markAllAsRead() {
    const { data } = await api.patch<ApiResponse<null>>('/notifications/read-all')
    return data
  }

  async remove(id: string) {
    const { data } = await api.delete<ApiResponse<null>>(`/notifications/${id}`)
    return data
  }
}

export const notificationService = new NotificationService()
