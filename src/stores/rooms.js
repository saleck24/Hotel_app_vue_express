import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export const useRoomStore = defineStore('rooms', () => {
    const rooms = ref([])
    const currentRoom = ref(null)
    const loading = ref(false)
    const error = ref(null)

    async function fetchRooms() {
        loading.value = true
        error.value = null
        try {
            const response = await api.get('/rooms')
            rooms.value = response.data
        } catch (err) {
            error.value = err.message || 'Failed to fetch rooms'
        } finally {
            loading.value = false
        }
    }

    async function fetchRoom(id) {
        loading.value = true
        error.value = null
        try {
            const response = await api.get(`/rooms/${id}`)
            currentRoom.value = response.data
        } catch (err) {
            error.value = err.message || 'Failed to fetch room details'
        } finally {
            loading.value = false
        }
    }

    return {
        rooms,
        currentRoom,
        loading,
        error,
        fetchRooms,
        fetchRoom
    }
})
