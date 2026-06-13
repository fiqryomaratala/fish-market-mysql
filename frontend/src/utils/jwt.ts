import type { Identifier, UserProfile, UserRole } from '@/types/api'

type JwtPayload = {
  sub?: Identifier
  id?: Identifier
  name?: string
  email?: string
  role?: UserRole
  exp?: number
  iat?: number
}

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized.padEnd(
    normalized.length + ((4 - (normalized.length % 4)) % 4),
    '=',
  )

  return atob(padded)
}

export function decodeJwt(token: string) {
  try {
    const [, payload] = token.split('.')

    if (!payload) {
      return null
    }

    return JSON.parse(decodeBase64Url(payload)) as JwtPayload
  } catch {
    return null
  }
}

export function isTokenExpired(token: string) {
  const payload = decodeJwt(token)

  if (!payload?.exp) {
    return false
  }

  return payload.exp * 1000 <= Date.now()
}

export function getRoleFromToken(token: string) {
  return decodeJwt(token)?.role ?? null
}

export function getUserFromToken(token: string): UserProfile | null {
  const payload = decodeJwt(token)

  if (!payload?.role) {
    return null
  }

  return {
    id: payload.sub ?? payload.id ?? '',
    name: payload.name ?? 'Authenticated User',
    email: payload.email ?? '',
    role: payload.role,
  }
}
