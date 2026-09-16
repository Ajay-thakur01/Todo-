import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// Attach auth token to every request
api.interceptors.request.use((config) => {
  try {
    const stored = localStorage.getItem('flowtask-auth')
    const parsed = stored ? JSON.parse(stored) : null
    const token = parsed?.state?.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  } catch {
    // Ignore parse errors
  }
  return config
})

// Global response error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired — clear auth and redirect
      localStorage.removeItem('flowtask-auth')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
