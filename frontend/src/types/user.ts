export const USER_ROLES = ['Admin', 'Staff', 'Customer'] as const

export const USER_STATUS_OPTIONS = ['Active', 'Inactive', 'Suspended'] as const

export type UserRole = (typeof USER_ROLES)[number]
export type UserStatus = (typeof USER_STATUS_OPTIONS)[number]

export interface User {
  id: number
  name: string
  email: string
  phone: string
  address: string
  avatar: string
  avatar_url?: string
  photo_url?: string
  role: string
  status: string
  last_login: string
  created_at: string
  updated_at: string
}

export interface UserListMeta {
  page: number
  limit: number
  total: number
}

export interface UserListParams {
  page?: number
  limit?: number
  search?: string
  role?: string
  status?: string
}

export interface UserListResult {
  items: User[]
  meta: UserListMeta
}

export interface UserCreateInput {
  name: string
  email: string
  phone: string
  address: string
  password: string
  role: string
  status: string
}

export interface UserUpdateInput {
  name: string
  phone: string
  address: string
  role: string
  status: string
}

export interface UserRoleUpdateInput {
  role: string
}

export interface UserStatusUpdateInput {
  status: string
}

export interface UserSummary {
  total: number
  admin: number
  staff: number
  customer: number
  active: number
}
