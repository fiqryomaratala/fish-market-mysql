// Authentication utilities for JWT token management
import { decodeJwt, isTokenExpired, getRoleFromToken } from './jwt'

const TOKEN_KEY = 'fish_market_token'
const REFRESH_TOKEN_KEY = 'fish_market_refresh_token'

/**
 * Get authentication token from localStorage
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') {
    return null
  }

  const token = localStorage.getItem(TOKEN_KEY)
  
  if (!token) {
    return null
  }

  // Check if token is expired
  if (isTokenExpired(token)) {
    // Remove expired token
    removeAuthToken()
    return null
  }

  return token
}

/**
 * Set authentication token in localStorage
 */
export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') {
    return
  }

  localStorage.setItem(TOKEN_KEY, token)
}

/**
 * Set refresh token in localStorage
 */
export function setRefreshToken(token: string): void {
  if (typeof window === 'undefined') {
    return
  }

  localStorage.setItem(REFRESH_TOKEN_KEY, token)
}

/**
 * Get refresh token from localStorage
 */
export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') {
    return null
  }

  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

/**
 * Remove authentication tokens from localStorage
 */
export function removeAuthToken(): void {
  if (typeof window === 'undefined') {
    return
  }

  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!getAuthToken()
}

/**
 * Get user role from token
 */
export function getUserRole(): string | null {
  const token = getAuthToken()
  
  if (!token) {
    return null
  }

  return getRoleFromToken(token)
}

/**
 * Get user ID from token
 */
export function getUserId(): string | number | null {
  const token = getAuthToken()
  
  if (!token) {
    return null
  }

  const payload = decodeJwt(token)
  return payload?.sub || payload?.id || null
}

/**
 * Get user email from token
 */
export function getUserEmail(): string | null {
  const token = getAuthToken()
  
  if (!token) {
    return null
  }

  const payload = decodeJwt(token)
  return payload?.email || null
}

/**
 * Get user name from token
 */
export function getUserName(): string | null {
  const token = getAuthToken()
  
  if (!token) {
    return null
  }

  const payload = decodeJwt(token)
  return payload?.name || null
}

/**
 * Clear all authentication data
 */
export function clearAuthData(): void {
  removeAuthToken()
}