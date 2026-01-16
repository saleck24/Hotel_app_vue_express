import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
    const user = ref(JSON.parse(localStorage.getItem('user')) || null)
    const token = ref(localStorage.getItem('token') || null)
    const router = useRouter()

    const isAuthenticated = computed(() => !!token.value)
    const isAdmin = computed(() => user.value?.role === 'admin' || user.value?.isAdmin) // Adjust based on API response

    async function login(credentials) {
        try {
            const response = await api.post('/auth/login', credentials)
            // Assuming response.data contains { token, user } or similar
            // The prompt example just says "Example Value Schema { email, password }" for input
            // I'll assume standard JWT response: { token: '...', user: { ... } }
            // I will need to verify the actual response structure if it fails.

            // For now, let's assume the token is directly in response.data.token or similar
            // Code below tries to handle common patterns
            const data = response.data

            const receivedToken = data.token || data.accessToken
            const receivedUser = data.user || data.formattedUser // Make sure to adapt this

            if (receivedToken) {
                token.value = receivedToken
                user.value = receivedUser

                localStorage.setItem('token', receivedToken)
                localStorage.setItem('user', JSON.stringify(receivedUser))

                return true
            }
        } catch (error) {
            throw error
        }
    }

    async function register(userData) {
        try {
            await api.post('/auth/register', userData)
            // Usually register allows immediate login or requires email verification
            // For now just return true
            return true
        } catch (error) {
            throw error
        }
    }

    function logout() {
        user.value = null
        token.value = null
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        // We can't access router directly here easily if not inside setup, 
        // but we can let the component handle redirection or use window.location
        window.location.href = '/login'
    }

    return {
        user,
        token,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout
    }
})
