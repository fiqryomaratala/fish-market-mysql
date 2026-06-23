export const NOTIFICATION_TYPES = [
  'ORDER',
  'INVENTORY',
  'HARVEST',
  'BATCH',
  'FEEDING',
  'SYSTEM',
  'USER',
] as const

export type NotificationType = (typeof NOTIFICATION_TYPES)[number]
export type NotificationTypeFilter = 'all' | NotificationType
export type NotificationStatusFilter = 'all' | 'read' | 'unread'

export interface NotificationItem {
  id: number
  title: string
  message: string
  type: string
  is_read: boolean
  created_at: string
}

export interface NotificationsMeta {
  page: number
  limit: number
  total: number
  total_pages: number
}

export interface NotificationsResult {
  items: NotificationItem[]
  meta: NotificationsMeta
}

export function normalizeNotificationType(value: string) {
  const normalized = value.trim().toUpperCase().replace(/\s+/g, '_')

  if (normalized === 'FISH_BATCH' || normalized === 'FISHBATCH' || normalized === 'BATCH') {
    return 'BATCH'
  }

  return normalized
}

export function getNotificationTypeLabel(value: string) {
  const normalized = normalizeNotificationType(value)

  if (normalized === 'ORDER') {
    return 'Order'
  }

  if (normalized === 'INVENTORY') {
    return 'Inventory'
  }

  if (normalized === 'HARVEST') {
    return 'Harvest'
  }

  if (normalized === 'BATCH') {
    return 'Fish Batch'
  }

  if (normalized === 'FEEDING') {
    return 'Feeding'
  }

  if (normalized === 'SYSTEM') {
    return 'System'
  }

  if (normalized === 'USER') {
    return 'User'
  }

  return value || 'System'
}

export function getNotificationTypeQueryValue(value: NotificationTypeFilter) {
  if (value === 'all') {
    return undefined
  }

  return value
}
