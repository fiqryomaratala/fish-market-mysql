export type UserRole = 'admin' | 'staff' | 'customer'

export interface User {
  id: number
  name: string
  email: string
  role: UserRole
  created_at: string
  updated_at: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface ApiResponse<T> {
  success?: boolean
  message: string
  data: T
  errors?: Record<string, string> | string[] | null
}

export const ACCESS_TOKEN_KEY = 'access_token'
