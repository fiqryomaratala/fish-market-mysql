import type { ReactNode } from 'react'
import { createContext, useEffect, useMemo, useState } from 'react'
import { clearAuthStorage, setUnauthorizedHandler } from '@/api/axios'
import { authService } from '@/services/auth.service'
import { cartService } from '@/services/cart.service'
import { queryClient } from '@/lib/query-client'
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
  UserPermission,
  UserRole,
} from '@/types/auth'
import { ACCESS_TOKEN_KEY } from '@/types/auth'

interface AuthContextValue {
  user: User | null
  token: string | null
  role: UserRole | null
  permissions: UserPermission[]
  isAuthenticated: boolean
  loading: boolean
  login: (payload: LoginRequest) => Promise<User>
  register: (payload: RegisterRequest) => Promise<User>
  logout: () => Promise<void>
  refreshUser: () => Promise<User | null>
  hasRole: (role: string) => boolean
  hasAnyRole: (...roles: string[]) => boolean
  hasPermission: (permission: string) => boolean
  hasAnyPermission: (...permissions: string[]) => boolean
  isAdmin: () => boolean
  isStaff: () => boolean
  isCustomer: () => boolean
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

function applyAuthState(
  auth: AuthResponse | null,
  setToken: (value: string | null) => void,
  setUser: (value: User | null) => void,
) {
  setToken(auth?.token ?? null)
  setUser(auth?.user ?? null)
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const role = user?.role ?? null
  const permissions = user?.permissions ?? []

  useEffect(() => {
    const handleUnauthorized = () => {
      clearAuthStorage()
      applyAuthState(null, setToken, setUser)
      queryClient.clear()
    }

    setUnauthorizedHandler(handleUnauthorized)

    return () => {
      setUnauthorizedHandler(null)
    }
  }, [])

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem(ACCESS_TOKEN_KEY)

      if (!storedToken) {
        setLoading(false)
        return
      }

      setToken(storedToken)

      try {
        const profile = await authService.getProfile()
        setUser(profile)
      } catch {
        clearAuthStorage()
        applyAuthState(null, setToken, setUser)
      } finally {
        setLoading(false)
      }
    }

    void initializeAuth()
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      role,
      permissions,
      isAuthenticated: Boolean(user && token),
      loading,
      login: async (payload) => {
        const auth = await authService.login(payload)
        applyAuthState(auth, setToken, setUser)
        if (auth.user.role === 'customer') {
          try {
            await cartService.syncGuestCartToServer()
          } catch {
            // Keep login successful even if some guest cart items can no longer be synced.
          }
          await queryClient.invalidateQueries({ queryKey: ['cart'] })
        }
        return auth.user
      },
      register: async (payload) => {
        const auth = await authService.register(payload)
        applyAuthState(auth, setToken, setUser)
        if (auth.user.role === 'customer') {
          try {
            await cartService.syncGuestCartToServer()
          } catch {
            // Keep register flow successful even if guest cart sync hits stale items.
          }
          await queryClient.invalidateQueries({ queryKey: ['cart'] })
        }
        return auth.user
      },
      logout: async () => {
        await authService.logout()
        clearAuthStorage()
        applyAuthState(null, setToken, setUser)
        queryClient.clear()
        window.location.replace('/')
      },
      refreshUser: async () => {
        const currentToken = localStorage.getItem(ACCESS_TOKEN_KEY)

        if (!currentToken) {
          applyAuthState(null, setToken, setUser)
          return null
        }

        setToken(currentToken)

        try {
          const profile = await authService.getProfile()
          setUser(profile)
          return profile
        } catch {
          clearAuthStorage()
          applyAuthState(null, setToken, setUser)
          return null
        }
      },
      hasRole: (nextRole) => role === nextRole,
      hasAnyRole: (...roles) => roles.includes(role ?? ''),
      hasPermission: (permission) => permissions.includes(permission),
      hasAnyPermission: (...nextPermissions) =>
        nextPermissions.some((permission) => permissions.includes(permission)),
      isAdmin: () => role === 'admin',
      isStaff: () => role === 'staff',
      isCustomer: () => role === 'customer',
    }),
    [loading, permissions, role, token, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
