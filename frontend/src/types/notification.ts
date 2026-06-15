export interface NotificationItem {
  id: number
  title: string
  description: string
  type: string
  is_read: boolean
  created_at: string
}

export interface NotificationsMeta {
  page: number
  limit: number
  total: number
}

export interface NotificationsResult {
  items: NotificationItem[]
  meta: NotificationsMeta
}
