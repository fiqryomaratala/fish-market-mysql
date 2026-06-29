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

function buildNotificationTitle(type: string) {
  const normalized = type.trim().toUpperCase().replace(/\s+/g, '_')

  if (normalized === 'ORDER') {
    return 'Pesanan'
  }

  if (normalized === 'INVENTORY') {
    return 'Inventaris'
  }

  if (normalized === 'HARVEST') {
    return 'Panen'
  }

  if (normalized === 'BATCH' || normalized === 'FISH_BATCH' || normalized === 'FISHBATCH') {
    return 'Batch Ikan'
  }

  if (normalized === 'FEEDING') {
    return 'Pemberian Pakan'
  }

  return 'Notifikasi'
}

function buildNotificationMessage(type: string, title: string) {
  const normalized = type.trim().toUpperCase().replace(/\s+/g, '_')

  if (normalized === 'ORDER') {
    return 'Ada pembaruan pada pesanan Anda. Silakan buka detail notifikasi untuk melihat informasi terbaru.'
  }

  if (normalized === 'INVENTORY') {
    return 'Ada pembaruan pada data inventaris. Silakan periksa detail notifikasi untuk informasi lebih lanjut.'
  }

  if (normalized === 'HARVEST') {
    return 'Ada pembaruan terkait proses panen. Silakan cek detail notifikasi untuk informasi lengkap.'
  }

  if (normalized === 'BATCH' || normalized === 'FISH_BATCH' || normalized === 'FISHBATCH') {
    return 'Ada pembaruan pada batch ikan. Silakan lihat detail notifikasi untuk informasi terbaru.'
  }

  if (normalized === 'FEEDING') {
    return 'Ada pembaruan jadwal atau aktivitas pemberian pakan. Silakan cek detail notifikasi.'
  }

  return `Ada informasi terbaru pada ${title.toLowerCase()}.`
}

function normalizeNotificationTitle(type: string, rawTitle: string) {
  const title = rawTitle.trim()
  const normalized = title.toLowerCase()

  if (!title || normalized === 'notification') {
    return buildNotificationTitle(type)
  }

  if (normalized === 'order') {
    return 'Pesanan'
  }

  if (normalized === 'inventory') {
    return 'Inventaris'
  }

  if (normalized === 'harvest') {
    return 'Panen'
  }

  if (normalized === 'batch' || normalized === 'fish batch') {
    return 'Batch Ikan'
  }

  if (normalized === 'low stock') {
    return 'Stok Hampir Habis'
  }

  if (normalized === 'order created') {
    return 'Pesanan Berhasil Dibuat'
  }

  if (normalized === 'harvest completed') {
    return 'Panen Berhasil Dicatat'
  }

  return title
}

function normalizeNotificationMessage(type: string, rawMessage: string, title: string) {
  const message = rawMessage.trim()
  const lowerMessage = message.toLowerCase()

  if (
    !message ||
    lowerMessage.includes('at the shrimp') ||
    lowerMessage.includes('whomever kiss quickly murder the work') ||
    lowerMessage.includes('talk enthusiastically')
  ) {
    return buildNotificationMessage(type, title)
  }

  return message
}

function mapNotification(item: NotificationApiItem, fallbackId: number): NotificationItem {
  const type = toStringValue(item.type, 'GENERAL')
  const title = normalizeNotificationTitle(type, toStringValue(item.title, 'Notification'))

  return {
    id: toNumber(item.id, fallbackId),
    title,
    message: normalizeNotificationMessage(type, toStringValue(item.message), title),
    type,
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
