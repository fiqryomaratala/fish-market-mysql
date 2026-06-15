import api from '@/api/axios'
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
  permissions?: UserPermission[]
  created_at?: string
  updated_at?: string
}

function normalizeUser(
  user: Partial<User> & Pick<User, 'id' | 'name' | 'email' | 'role'>,
): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
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
      ApiResponse<Partial<User> & Pick<User, 'id' | 'name' | 'email' | 'role'>>
    >('/auth/profile')

    return normalizeUser(response.data.data)
  }
}

export const authService = new AuthService()
