export const ACTIVITY_ROLE_OPTIONS = ['admin', 'staff', 'customer'] as const

export const ACTIVITY_MODULE_OPTIONS = [
  'users',
  'products',
  'inventory',
  'ponds',
  'fish-batches',
  'feeding-logs',
  'harvests',
  'orders',
  'reports',
] as const

export type ActivityRoleFilter = (typeof ACTIVITY_ROLE_OPTIONS)[number]
export type ActivityModuleFilter = (typeof ACTIVITY_MODULE_OPTIONS)[number]
export type ActivityViewMode = 'table' | 'timeline'

export interface ActivityLog {
  id: number
  user_name: string
  user_role: string
  action: string
  module: string
  description: string
  ip_address: string
  created_at: string
}

export interface ActivityLogListParams {
  page?: number
  limit?: number
  module?: string
  action?: string
  user_id?: number
}

export interface ActivityLogListMeta {
  page: number
  limit: number
  total: number
}

export interface ActivityLogListResult {
  items: ActivityLog[]
  meta: ActivityLogListMeta
}

export interface ActivityLogApiItem {
  id?: number
  user?: string
  user_name?: string
  user_role?: string
  action?: string
  module?: string
  description?: string
  ip_address?: string
  created_at?: string
}
