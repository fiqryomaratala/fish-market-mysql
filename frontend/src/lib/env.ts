const fallbackApiBaseUrl = 'http://localhost/api'

export const env = {
  apiBaseUrl: import.meta.env.VITE_API_URL ?? fallbackApiBaseUrl,
}
