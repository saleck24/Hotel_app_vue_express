<template>
  <div class="home-view">
    <section class="hero">
      <div class="hero-content container">
        <h1 class="hero-title">Vivez le luxe comme jamais auparavant</h1>
        <p class="hero-subtitle">Découvrez nos chambres et suites premium pour votre escapade parfaite.</p>
        <RouterLink to="/rooms" class="btn btn-secondary btn-lg">Parcourir les chambres</RouterLink>
      </div>
    </section>

    <section class="featured-rooms section-padding">
      <div class="container featured-rooms-inner">
        <div class="section-header">
          <h2 class="section-title">Chambres Vedettes</h2>
          <p class="section-subtitle">Sélectionnées pour votre confort</p>
        </div>

      <div v-if="loading" class="text-center">Chargement des chambres...</div>
      <div v-else class="rooms-grid">
        <div v-for="room in featuredRooms" :key="room.id" class="room-card">
          <img :src="room.images?.[0] || 'https://placehold.co/600x400?text=Room'" :alt="room.type" class="room-image">
          <div class="room-info">
            <div class="room-header">
              <h3 class="room-type">{{ room.type }}</h3>
              <span class="room-price">{{ room.prix }} MRU <span class="per-night">/ nuit</span></span>
            </div>
            <p class="room-desc">{{ room.description }}</p>
            <RouterLink :to="`/rooms/${room.id}`" class="btn btn-outline btn-md">Voir Détails</RouterLink>
          </div>
        </div>
      </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useRoomStore } from '@/stores/rooms'
import { storeToRefs } from 'pinia'

const roomStore = useRoomStore()
const { rooms, loading } = storeToRefs(roomStore)

// Mock featured rooms if API returns nothing or filter explicit featured flag
const featuredRooms = computed(() => {
  return rooms.value
    .filter(r => r.statut === 'DISPONIBLE')
    .slice(0, 3)
})

onMounted(() => {
  roomStore.fetchRooms()
})
</script>

<style scoped>
.hero {
  background-image: linear-gradient(rgba(26, 42, 68, 0.7), rgba(26, 42, 68, 0.7)), url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80');
  background-size: cover;
  background-position: center;
  height: 80vh;
  display: flex;
  align-items: center;
  color: white;
  text-align: center;
}

.hero-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 var(--spacing-md);
  max-width: 1000px;
  margin: 0 auto;
}

.featured-rooms-inner {
  max-width: 1000px;
  margin: 0 auto;
}

.hero-title {
  font-family: var(--font-heading);
  font-size: 4.5rem;
  font-weight: 800;
  margin-bottom: var(--spacing-md);
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.hero-subtitle {
  font-size: 1.5rem;
  margin-bottom: var(--spacing-xl);
  max-width: 800px;
  opacity: 0.9;
}

.btn-lg {
  padding: 1rem 3rem;
  font-size: 1.125rem;
}

.section-padding {
  padding: 6rem 0;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-title {
  font-family: var(--font-heading);
  font-size: 3.5rem;
  font-weight: 800;
  color: var(--color-primary);
  margin-bottom: var(--spacing-sm);
  letter-spacing: -0.01em;
}

.rooms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-lg);
  justify-content: center;
}

.room-card {
  background: white;
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transition: transform 0.2s;
}

.room-card:hover {
  transform: translateY(-5px);
}

.room-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.room-info {
  padding: var(--spacing-md);
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
}

.per-night {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  font-weight: 400;
}

.room-desc {
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-md);
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.text-center {
  text-align: center;
}

.mt-lg {
  margin-top: var(--spacing-lg);
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
}
</style>
