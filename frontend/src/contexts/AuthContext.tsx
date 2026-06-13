import type { ReactNode } from 'react'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/api/axios'
import { authService } from '@/services'
import type { LoginPayload, RegisterPayload, UserProfile, UserRole } from '@/types/api'
import { getRoleFromToken, getUserFromToken, isTokenExpired } from '@/utils/jwt'

type AuthContextValue = {
  isAuthenticated: boolean
  isLoading: boolean
  token: string | null
  user: UserProfile | null
  role: UserRole | null
  login: (payload: LoginPayload) => Promise<UserProfile | null>
  logout: () => Promise<void>
  register: (payload: RegisterPayload) => Promise<UserProfile | null>
  refreshUser: () => Promise<UserProfile | null>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

type AuthProviderProps = {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const clearAuth = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    setToken(null)
    setUser(null)
  }, [])

  const applyToken = useCallback((nextToken: string | null) => {
    if (!nextToken || isTokenExpired(nextToken)) {
      return null
    }

    const decodedUser = getUserFromToken(nextToken)

    if (!decodedUser) {
      clearAuth()
      return null
    }

    localStorage.setItem(AUTH_TOKEN_KEY, nextToken)
    setToken(nextToken)
    setUser(decodedUser)

    return decodedUser
  }, [])

  const refreshUser = useCallback(async () => {
    const storedToken = localStorage.getItem(AUTH_TOKEN_KEY)

    if (!storedToken || isTokenExpired(storedToken)) {
      clearAuth()
      return null
    }

    const decodedUser = applyToken(storedToken)

    try {
      const response = await authService.getProfile()
      setUser({
        ...response.data,
        role: getRoleFromToken(storedToken) ?? response.data.role,
      })
      return response.data
    } catch {
      setUser(decodedUser)
      return decodedUser
    }
  }, [applyToken, clearAuth])

  const login = useCallback(async (payload: LoginPayload) => {
    const response = await authService.login(payload)
    const authenticatedUser = applyToken(response.data.token)
    setUser(response.data.user ?? authenticatedUser)
    return response.data.user ?? authenticatedUser
  }, [applyToken])

  const register = useCallback(async (payload: RegisterPayload) => {
    const response = await authService.register(payload)
    const authenticatedUser = applyToken(response.data.token)
    setUser(response.data.user ?? authenticatedUser)
    return response.data.user ?? authenticatedUser
  }, [applyToken])

  const logout = useCallback(async () => {
    await authService.logout()
    clearAuth()
  }, [clearAuth])

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem(AUTH_TOKEN_KEY)

      if (!storedToken || isTokenExpired(storedToken)) {
        clearAuth()
        setIsLoading(false)
        return
      }

      applyToken(storedToken)
      await refreshUser()
      setIsLoading(false)
    }

    void initializeAuth()
  }, [applyToken, clearAuth, refreshUser])

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: Boolean(token && user),
      isLoading,
      token,
      user,
      role: token ? getRoleFromToken(token) : null,
      login,
      logout,
      register,
      refreshUser,
    }),
    [isLoading, login, logout, refreshUser, register, token, user],
  )

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
