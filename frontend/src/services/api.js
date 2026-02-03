import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const api = axios.create({
    baseURL: 'http://localhost:3000/api', // backend
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
})

// Request interceptor to add token
api.interceptors.request.use(config => {
    // Attempt to use authStore if inside a component context or using Pinia
    try {
        const authStore = useAuthStore()
        if (authStore.token && authStore.token !== 'SET_BY_COOKIE') {
            config.headers.Authorization = `Bearer ${authStore.token}`
        }
    } catch (e) {
        // Fallback to localStorage if Pinia is not yet initialized or outside Pinia context
        const token = localStorage.getItem('token')
        if (token && token !== 'SET_BY_COOKIE') {
            config.headers.Authorization = `Bearer ${token}`
        }
    }
    return config
})

// Response interceptor to handle 401
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            try {
                const authStore = useAuthStore()
                authStore.logout()
            } catch (e) {
                localStorage.removeItem('token')
                localStorage.removeItem('user')

                // Only redirect if we are not already on a guest-allowed page
                const isPublicPage = window.location.pathname === '/' ||
                    window.location.pathname === '/login' ||
                    window.location.pathname === '/rooms';

                if (!isPublicPage) {
                    window.location.href = '/login'
                }
            }
        }
        return Promise.reject(error)
    }
)

export default api
