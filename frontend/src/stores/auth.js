import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
    const user = ref(JSON.parse(localStorage.getItem('user')) || null)
    const token = ref(localStorage.getItem('token') || null)
    const router = useRouter()

    const isAuthenticated = computed(() => !!token.value)
    const isAdmin = computed(() => user.value?.role?.toUpperCase() === 'ADMIN')

    async function login(credentials) {
        try {
            const response = await api.post('/auth/login', credentials)
            const data = response.data
            const receivedUser = data.user

            user.value = receivedUser
            // Since token is now in an HttpOnly cookie, we don't handle it here manually.
            // But we set a placeholder to keep logic and router guards working.
            token.value = 'SET_BY_COOKIE'

            localStorage.setItem('user', JSON.stringify(receivedUser))
            localStorage.setItem('token', 'SET_BY_COOKIE')

            return true
        } catch (error) {
            throw error
        }
    }

    async function register(userData) {
        try {
            await api.post('/auth/register', userData)
            return true
        } catch (error) {
            throw error
        }
    }

    async function logout() {
        try {
            await api.post('/auth/logout')
        } catch (error) {
            console.error('Logout error', error)
        } finally {
            user.value = null
            token.value = null
            localStorage.removeItem('user')
            localStorage.removeItem('token')
            window.location.href = '/login'
        }
    }

    async function updateUser(userData) {
        user.value = userData
        localStorage.setItem('user', JSON.stringify(userData))
    }

    return {
        user,
        token,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
        updateUser
    }
})
