import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// ── Attach JWT token to every request ─────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// ── Auto-refresh expired access tokens ────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const refreshToken = localStorage.getItem('refresh_token')
      if (refreshToken) {
        try {
          const res = await axios.post(`${API_BASE_URL}/api/auth/token/refresh/`, {
            refresh: refreshToken,
          })
          const { access } = res.data
          localStorage.setItem('access_token', access)
          originalRequest.headers.Authorization = `Bearer ${access}`
          return api(originalRequest)
        } catch {
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          window.location.href = '/login'
        }
      }
    }
    return Promise.reject(error)
  }
)

// ── Auth endpoints ────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/api/auth/register/', data),
  login:    (data) => api.post('/api/auth/login/', data),
  logout:   (refresh) => api.post('/api/auth/logout/', { refresh }),
  profile:  () => api.get('/api/auth/profile/'),
}

// ── Detection endpoints ────────────────────────────────────────────────────────
export const detectionAPI = {
  analyze:        (data)    => api.post('/api/detection/analyze/', data),
  getHistory:     (page = 1) => api.get(`/api/detection/history/?page=${page}`),
  deleteAnalysis: (id)      => api.delete(`/api/detection/history/${id}/`),
  getStats:       ()        => api.get('/api/detection/stats/'),
}

export default api
