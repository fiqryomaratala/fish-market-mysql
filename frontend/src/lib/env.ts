const fallbackApiBaseUrl = 'http://localhost:8080/api'

export const env = {
  apiBaseUrl: import.meta.env.VITE_API_URL ?? fallbackApiBaseUrl,
}
