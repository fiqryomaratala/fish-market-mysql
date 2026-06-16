import api from '@/api/axios'
import { apiConfig } from '@/config/api'
import type {
  ApiResponse,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
  UserPermission,
} from '@/types/auth'
import { ACCESS_TOKEN_KEY } from '@/types/auth'

type RegisterApiResponse = {
  id: number
  name: string
  email: string
  role: User['role']
  avatar?: string
  avatar_url?: string
  photo_url?: string
  permissions?: UserPermission[]
  created_at?: string
  updated_at?: string
}

function resolveAssetUrl(value: unknown) {
  if (typeof value !== 'string' || !value) {
    return ''
  }

  if (/^https?:\/\//i.test(value)) {
    return value
  }

  const baseOrigin = new URL(apiConfig.baseUrl, window.location.origin).origin
  return new URL(value, baseOrigin).toString()
}

function normalizeUser(
  user: Partial<User> &
    Pick<User, 'id' | 'name' | 'email' | 'role'> & {
      avatar_url?: string
      photo_url?: string
    },
): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: resolveAssetUrl(user.avatar ?? user.avatar_url ?? user.photo_url),
    permissions: user.permissions ?? [],
    created_at: user.created_at ?? '',
    updated_at: user.updated_at ?? '',
  }
}

class AuthService {
  async login(payload: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', payload)
    const auth = {
      token: response.data.data.token,
      user: normalizeUser(response.data.data.user),
    }

    localStorage.setItem(ACCESS_TOKEN_KEY, auth.token)

    return auth
  }

  async register(payload: RegisterRequest): Promise<AuthResponse> {
    await api.post<ApiResponse<RegisterApiResponse>>('/auth/register', payload)
    return this.login({
      email: payload.email,
      password: payload.password,
    })
  }

  async logout(): Promise<void> {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
  }

  async getProfile(): Promise<User> {
    const response = await api.get<
      ApiResponse<
        Partial<User> &
          Pick<User, 'id' | 'name' | 'email' | 'role'> & {
            avatar_url?: string
            photo_url?: string
          }
      >
    >('/auth/profile')

    return normalizeUser(response.data.data)
  }
}

export const authService = new AuthService()
