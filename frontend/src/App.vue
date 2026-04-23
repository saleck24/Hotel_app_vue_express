<template>
  <NotificationToast />
  <component :is="layout">
    <RouterView />
  </component>
</template>

<script setup>
import { computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notifications'
import { socket } from '@/services/socket'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import NotificationToast from '@/components/ui/NotificationToast.vue'

const route = useRoute()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

import { useI18n } from 'vue-i18n'
const { locale } = useI18n()

const layout = computed(() => {
  if (route.meta.layout === false) return 'div'
  return route.meta.layout || DefaultLayout
})

// Support RTL pour l'Arabe
const isRTL = computed(() => locale.value === 'ar')

watch(isRTL, (val) => {
  document.documentElement.dir = val ? 'rtl' : 'ltr'
  document.documentElement.lang = locale.value
}, { immediate: true })

watch(locale, (newLocale) => {
  localStorage.setItem('locale', newLocale)
})


// Socket listener for new reservations (Admin only)
watch(() => authStore.isAuthenticated, (val) => {
  if (val) {
    if (!socket.connected) socket.connect()
    
    if (authStore.isAdmin) {
      socket.on('newReservation', (data) => {
        notificationStore.addNotification({
          title: 'Nouvelle Réservation !',
          message: `${data.user} a réservé la chambre ${data.room} pour ${data.total} MRU.`,
          type: 'info'
        })
      })
    }
  } else {
    socket.disconnect()
    socket.off('newReservation')
  }
}, { immediate: true })

onMounted(() => {
  if (authStore.isAuthenticated && !socket.connected) {
    socket.connect()
  }
})
</script>


<style>
html.dark {
  color-scheme: dark;
}
</style>
