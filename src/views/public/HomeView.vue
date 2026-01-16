<template>
  <div class="home-view">
    <section class="hero">
      <div class="hero-content container">
        <h1 class="hero-title">Experience Luxury Like Never Before</h1>
        <p class="hero-subtitle">Discover our premium rooms and suites for your perfect getaway.</p>
        <RouterLink to="/rooms" class="btn btn-secondary btn-lg">Browse Rooms</RouterLink>
      </div>
    </section>

    <section class="featured-rooms container section-padding">
      <div class="section-header">
        <h2 class="section-title">Featured Rooms</h2>
        <p class="section-subtitle">Handpicked for your comfort</p>
      </div>

      <div v-if="loading" class="text-center">Loading rooms...</div>
      <div v-else class="rooms-grid">
        <div v-for="room in featuredRooms" :key="room.id" class="room-card">
          <img :src="room.images?.[0] || 'https://placehold.co/600x400?text=Room'" :alt="room.type" class="room-image">
          <div class="room-info">
            <div class="room-header">
              <h3 class="room-type">{{ room.type }}</h3>
              <span class="room-price">${{ room.prix }} <span class="per-night">/ night</span></span>
            </div>
            <p class="room-desc">{{ room.description }}</p>
            <RouterLink :to="`/rooms/${room.id}`" class="btn btn-outline btn-sm">View Details</RouterLink>
          </div>
        </div>
      </div>
      
      <div class="text-center mt-lg">
        <RouterLink to="/rooms" class="btn btn-primary">View All Rooms</RouterLink>
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
  return rooms.value.slice(0, 3)
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
}

.hero-title {
  font-family: var(--font-heading);
  font-size: 3.5rem;
  margin-bottom: var(--spacing-md);
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 1.25rem;
  margin-bottom: var(--spacing-xl);
  max-width: 600px;
}

.btn-lg {
  padding: var(--spacing-md) var(--spacing-2xl);
  font-size: 1.1rem;
}

.section-padding {
  padding-top: var(--spacing-2xl);
  padding-bottom: var(--spacing-2xl);
}

.section-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.section-title {
  font-family: var(--font-heading);
  font-size: 2.5rem;
  color: var(--color-primary);
  margin-bottom: var(--spacing-sm);
}

.rooms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-lg);
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
  display: -webkit-box;
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
