import { apiConfig } from '@/config/api'

function toStringValue(value: unknown, fallback = '') {
  return typeof value === 'string' ? value : fallback
}

export function resolveAssetUrl(value: unknown) {
  const rawValue = toStringValue(value)

  if (!rawValue) {
    return ''
  }

  if (/^https?:\/\//i.test(rawValue)) {
    return rawValue
  }

  const baseOrigin = new URL(apiConfig.baseUrl, window.location.origin).origin
  return new URL(rawValue, baseOrigin).toString()
}
