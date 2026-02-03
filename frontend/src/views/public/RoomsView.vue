<template>
  <div class="rooms-view container section-padding">
    <div class="rooms-header center-text">
       <h1 class="text-heading page-title">Nos Chambres & Suites</h1>
       <p class="subtitle">Trouvez votre hébergement idéal</p>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div> Chargement des chambres...
    </div>

    <div v-else-if="error" class="error-state">
      {{ error }}
    </div>

    <div v-else class="rooms-grid">
      <div v-for="room in availableRooms" :key="room.id" class="room-card">
        <div class="card-image-wrapper">
          <img :src="room.images?.[0] || 'https://placehold.co/600x400?text=Room'" :alt="room.type" class="room-image">
          <div class="room-status" v-if="room.statut !== 'DISPONIBLE'">{{ room.statut }}</div>
        </div>
        <div class="room-info">
          <div class="room-header">
            <h3 class="room-type">{{ room.type }}</h3>
            <span class="room-price">{{ room.prix }} MRU <span class="per-night">/ nuit</span></span>
          </div>
          <div class="room-meta">
             <span><i class="icon-user"></i> {{ room.capacite }} Personnes</span>
             <span>Ref: {{ room.numero }}</span>
          </div>
          <p class="room-desc">{{ room.description }}</p>
          <div class="card-actions">
            <button @click="goToDetails(room.id)" class="btn btn-outline w-full">Voir Détails</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useRoomStore } from '@/stores/rooms'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

const router = useRouter()
const roomStore = useRoomStore()
const authStore = useAuthStore()
const { rooms, loading, error } = storeToRefs(roomStore)

const availableRooms = computed(() => {
  return rooms.value.filter(r => r.statut === 'DISPONIBLE')
})

function goToDetails(roomId) {
  if (authStore.isAuthenticated) {
    router.push(`/rooms/${roomId}`)
  } else {
    router.push({ 
      path: '/login', 
      query: { redirect: `/rooms/${roomId}` } 
    })
  }
}

onMounted(() => {
  roomStore.fetchRooms()
})
</script>

<style scoped>
.rooms-view {
  max-width: 1000px;
  margin: 0 auto;
}

.section-padding {
  padding-top: var(--spacing-2xl);
  padding-bottom: var(--spacing-2xl);
}

.center-text {
  text-align: center;
}

.page-title {
  font-size: 2.5rem;
  color: var(--color-primary);
  margin-bottom: var(--spacing-xs);
}

.subtitle {
  font-size: 1.1rem;
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-2xl);
}

.rooms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: var(--spacing-lg);
}

.room-card {
  background: white;
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transition: transform 0.2s;
  display: flex;
  flex-direction: column;
}

.room-card:hover {
  transform: translateY(-5px);
}

.card-image-wrapper {
  position: relative;
  height: 250px;
}

.room-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.room-status {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(0,0,0,0.6);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
}

.room-info {
  padding: var(--spacing-md);
  flex: 1;
  display: flex;
  flex-direction: column;
}

.room-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-sm);
}

.room-type {
  font-family: var(--font-heading);
  font-size: 1.25rem;
  color: var(--color-primary);
}

.room-price {
  font-weight: 700;
  color: var(--color-secondary);
  font-size: 1.1rem;
}

.per-night {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  font-weight: 400;
}

.room-meta {
  display: flex;
  gap: var(--spacing-md);
  font-size: 0.9rem;
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-md);
}

.room-desc {
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-lg);
  line-clamp: 3;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

.w-full {
  width: 100%;
  text-align: center;
}

.loading-state, .error-state {
  text-align: center;
  padding: var(--spacing-2xl);
  font-size: 1.2rem;
}

.error-state {
  color: var(--color-danger);
}
</style>
