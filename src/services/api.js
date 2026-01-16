import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// 👉 Interceptor REQUEST : ajoute le token seulement s’il existe
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()

    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

// 👉 Interceptor RESPONSE : logout UNIQUEMENT si l'utilisateur était connecté
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore()

      // 🔥 IMPORTANT : ne rediriger que si un token existe
      if (authStore.token) {
        authStore.logout()
      }
    }

    return Promise.reject(error)
  }
)

export default api
