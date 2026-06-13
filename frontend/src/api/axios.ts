import axios from 'axios'

export const AUTH_TOKEN_KEY = 'token'
export const REFRESH_TOKEN_KEY = 'refreshToken'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY)

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
      localStorage.removeItem(AUTH_TOKEN_KEY)
      localStorage.removeItem(REFRESH_TOKEN_KEY)

      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  },
)

export default api
