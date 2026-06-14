import axios from 'axios'
import { apiConfig } from '@/config/api'
import { ACCESS_TOKEN_KEY } from '@/types/auth'

let unauthorizedHandler: (() => void) | null = null

export function setUnauthorizedHandler(handler: (() => void) | null) {
  unauthorizedHandler = handler
}

export function clearAuthStorage() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
}

const api = axios.create({
  baseURL: apiConfig.baseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY)

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  async (error) => Promise.reject(error),
)

api.interceptors.response.use(
  async (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      clearAuthStorage()
      unauthorizedHandler?.()

      if (window.location.pathname !== '/login') {
        window.location.replace('/login')
      }
    }

    return Promise.reject(error)
  },
)

export default api
