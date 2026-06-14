import type { ReactNode } from 'react'
import { createContext, useEffect, useMemo, useState } from 'react'
import { clearAuthStorage, setUnauthorizedHandler } from '@/api/axios'
import { authService } from '@/services/auth.service'
import { queryClient } from '@/lib/query-client'
import type { AuthResponse, LoginRequest, RegisterRequest, User } from '@/types/auth'
import { ACCESS_TOKEN_KEY } from '@/types/auth'

interface AuthContextValue {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  login: (payload: LoginRequest) => Promise<User>
  register: (payload: RegisterRequest) => Promise<User>
  logout: () => Promise<void>
  refreshUser: () => Promise<User | null>
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
      isAuthenticated: Boolean(user && token),
      loading,
      login: async (payload) => {
        const auth = await authService.login(payload)
        applyAuthState(auth, setToken, setUser)
        return auth.user
      },
      register: async (payload) => {
        const auth = await authService.register(payload)
        applyAuthState(auth, setToken, setUser)
        return auth.user
      },
      logout: async () => {
        await authService.logout()
        applyAuthState(null, setToken, setUser)
        queryClient.clear()
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
    }),
    [loading, token, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
