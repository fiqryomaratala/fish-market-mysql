import api, { AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/api/axios'
import type {
  ApiResponse,
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  UserProfile,
} from '@/types/api'

class AuthService {
  async login(payload: LoginPayload) {
    const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/login', payload)

    if (data.data.token) {
      localStorage.setItem(AUTH_TOKEN_KEY, data.data.token)
    }

    if (data.data.refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, data.data.refreshToken)
    }

    return data
  }

  async register(payload: RegisterPayload) {
    const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/register', payload)

    if (data.data.token) {
      localStorage.setItem(AUTH_TOKEN_KEY, data.data.token)
    }

    if (data.data.refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, data.data.refreshToken)
    }

    return data
  }

  async getProfile() {
    const { data } = await api.get<ApiResponse<UserProfile>>('/auth/profile')
    return data
  }

  async refreshToken(refreshToken: string) {
    const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/refresh', {
      refreshToken,
    })

    if (data.data.token) {
      localStorage.setItem(AUTH_TOKEN_KEY, data.data.token)
    }

    if (data.data.refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, data.data.refreshToken)
    }

    return data
  }

  async logout() {
    try {
      await api.post('/auth/logout')
    } finally {
      localStorage.removeItem(AUTH_TOKEN_KEY)
      localStorage.removeItem(REFRESH_TOKEN_KEY)
    }
  }
}

export const authService = new AuthService()
