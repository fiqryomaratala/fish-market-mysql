import api from '@/api/axios'
import type { ApiResponse, ListQueryParams } from '@/types/api'
import type { NotificationItem, NotificationsResult } from '@/types/notification'

type NotificationApiItem = {
  id?: number
  title?: string
  message?: string
  type?: string
  is_read?: boolean
  created_at?: string
}

type NotificationListEnvelope = {
  data?: {
    items?: NotificationApiItem[]
    meta?: {
      page?: number
      limit?: number
      total?: number
    }
  }
  message?: string
}

type NotificationDetailEnvelope = {
  data?: NotificationApiItem | null
  message?: string
}

function toNumber(value: unknown, fallback = 0) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function toStringValue(value: unknown, fallback = '') {
  return typeof value === 'string' ? value : fallback
}

function mapNotification(item: NotificationApiItem, fallbackId: number): NotificationItem {
  return {
    id: toNumber(item.id, fallbackId),
    title: toStringValue(item.title, 'Notification'),
    message: toStringValue(item.message),
    type: toStringValue(item.type, 'GENERAL'),
    is_read: Boolean(item.is_read),
    created_at: toStringValue(item.created_at),
  }
}

class NotificationService {
  async getNotifications(params: ListQueryParams = {}): Promise<NotificationsResult> {
    const { data } = await api.get<NotificationListEnvelope>('/notifications', {
      params,
    })

    const items = Array.isArray(data.data?.items) ? data.data.items : []
    const meta = data.data?.meta

    return {
      items: items.map((item, index) => mapNotification(item, index + 1)),
      meta: {
        page: toNumber(meta?.page, params.page ?? 1),
        limit: toNumber(meta?.limit, params.limit ?? 10),
        total: toNumber(meta?.total, items.length),
        total_pages: Math.max(
          1,
          Math.ceil(toNumber(meta?.total, items.length) / Math.max(1, toNumber(meta?.limit, params.limit ?? 10))),
        ),
      },
    }
  }

  async getAll(params?: ListQueryParams) {
    const result = await this.getNotifications(params)

    return {
      data: result.items,
      message: 'Notifications fetched successfully',
      meta: result.meta,
    }
  }

  async getNotification(id: number | string): Promise<NotificationItem> {
    const { data } = await api.get<NotificationDetailEnvelope>(`/notifications/${id}`)

    if (!data.data) {
      throw new Error('Notification detail is empty')
    }

    return mapNotification(data.data, Number(id) || 0)
  }

  async markAsRead(id: number | string) {
    const { data } = await api.put<ApiResponse<NotificationItem | null>>(`/notifications/${id}/read`)
    return data
  }

  async markAllAsRead() {
    const { data } = await api.put<ApiResponse<null>>('/notifications/read-all')
    return data
  }

  async deleteNotification(id: number | string) {
    const { data } = await api.delete<ApiResponse<null>>(`/notifications/${id}`)
    return data
  }
}

export const notificationService = new NotificationService()
