import api from '@/api/axios'
import type { ApiResponse } from '@/types/api'
import type {
  User,
  UserListParams,
  UserListResult,
  UserCreateInput,
  UserUpdateInput,
  UserRoleUpdateInput,
  UserStatusUpdateInput,
} from '@/types/user'

type UserApiRecord = Partial<User>

type UserListEnvelope = {
  data?: {
    items?: UserApiRecord[]
    meta?: {
      page?: number
      limit?: number
      total?: number
    }
  }
  message?: string
}

type UserDetailEnvelope = {
  data?: UserApiRecord
  message?: string
}

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 10

function toNumber(value: unknown, fallback = 0) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function toStringValue(value: unknown, fallback = '') {
  return typeof value === 'string' ? value : fallback
}

function mapUser(record: UserApiRecord, fallbackId = 0): User {
  return {
    id: toNumber(record.id, fallbackId),
    name: toStringValue(record.name, 'User'),
    email: toStringValue(record.email),
    phone: toStringValue(record.phone),
    address: toStringValue(record.address),
    avatar: toStringValue(record.avatar),
    role: toStringValue(record.role, 'Customer'),
    status: toStringValue(record.status, 'Active'),
    last_login: toStringValue(record.last_login),
    created_at: toStringValue(record.created_at),
    updated_at: toStringValue(record.updated_at),
  }
}

class UserService {
  async getUsers(params: UserListParams = {}): Promise<UserListResult> {
    const { data } = await api.get<UserListEnvelope>('/admin/users', {
      params: {
        page: params.page ?? DEFAULT_PAGE,
        limit: params.limit ?? DEFAULT_LIMIT,
        search: params.search || undefined,
        role: params.role || undefined,
        status: params.status || undefined,
      },
    })

    const items = Array.isArray(data.data?.items) ? data.data.items : []

    return {
      items: items.map((item, index) => mapUser(item, index + 1)),
      meta: {
        page: toNumber(data.data?.meta?.page, params.page ?? DEFAULT_PAGE),
        limit: toNumber(data.data?.meta?.limit, params.limit ?? DEFAULT_LIMIT),
        total: toNumber(data.data?.meta?.total, items.length),
      },
    }
  }

  async getUser(id: number): Promise<User> {
    const { data } = await api.get<UserDetailEnvelope>(`/admin/users/${id}`)

    if (!data.data) {
      throw new Error('User not found')
    }

    return mapUser(data.data, id)
  }

  async createUser(payload: UserCreateInput): Promise<User> {
    const { data } = await api.post<ApiResponse<UserApiRecord>>('/admin/users', payload)

    return mapUser(data.data)
  }

  async updateUser(id: number, payload: UserUpdateInput): Promise<User> {
    const { data } = await api.put<ApiResponse<UserApiRecord>>(`/admin/users/${id}`, payload)

    return mapUser(data.data, id)
  }

  async deleteUser(id: number) {
    const { data } = await api.delete<ApiResponse<null>>(`/admin/users/${id}`)
    return data
  }

  async updateUserRole(id: number, payload: UserRoleUpdateInput): Promise<User> {
    const { data } = await api.put<ApiResponse<UserApiRecord>>(`/admin/users/${id}/role`, payload)

    return mapUser(data.data, id)
  }

  async updateUserStatus(id: number, payload: UserStatusUpdateInput): Promise<User> {
    const { data } = await api.put<ApiResponse<UserApiRecord>>(`/admin/users/${id}/status`, payload)

    return mapUser(data.data, id)
  }
}

export const userService = new UserService()
