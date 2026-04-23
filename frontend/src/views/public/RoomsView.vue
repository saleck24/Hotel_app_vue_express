<template>
  <div class="rooms-view container section-padding">
    <div class="rooms-header center-text">
      <h1 class="text-heading page-title">{{ $t('rooms.title') }}</h1>
      <p class="subtitle">{{ $t('rooms.subtitle') }}</p>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="loading-dots"><span></span><span></span><span></span></div>
      <p>{{ $t('rooms.loading') }}</p>
    </div>

    <div v-else-if="error" class="error-state">
      {{ error }}
    </div>

    <div v-else>
      <!-- Résumé -->
      <div class="rooms-summary">
        <span class="summary-item">
          <span class="dot dot-available"></span>
          {{ $t('rooms.available_count', { count: disponibleCount }) }}
        </span>
        <span class="summary-sep">·</span>
        <span class="summary-item">
          <span class="dot dot-occupied"></span>
          {{ $t('rooms.occupied_count', { count: occupeeCount }) }}
        </span>
      </div>

      <div class="rooms-grid">
        <div
          v-for="room in rooms"
          :key="room.id"
          class="room-card"
          :class="{ 'room-card--occupied': !isAvailable(room) }"
        >
          <!-- Badge statut occupé -->
          <div v-if="!isAvailable(room)" class="occupied-badge">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {{ labelStatut(room.statut) }}
          </div>

          <!-- Image avec slideshow -->
          <div class="card-image-wrapper">
            <ImageSlideshow :images="room.images" />
            <!-- Overlay si non disponible -->
            <div v-if="!isAvailable(room)" class="image-overlay">
              <span class="overlay-text">{{ labelStatut(room.statut) }}</span>
            </div>
          </div>

          <!-- Infos -->
          <div class="room-info">
            <div class="room-header">
              <h3 class="room-type">{{ room.type }}</h3>
              <span class="room-price">{{ room.prix }} MRU <span class="per-night">{{ $t('rooms.per_night') }}</span></span>
            </div>
            <div class="room-meta">
              <span>👤 {{ $t('rooms.capacity', { count: room.capacite }) }}</span>
              <span>{{ $t('rooms.ref') }}: {{ room.numero }}</span>
            </div>
            <p class="room-desc">{{ room.description }}</p>

            <div class="card-actions">
              <!-- Pill statut -->
              <span class="status-pill" :class="isAvailable(room) ? 'pill-available' : 'pill-occupied'">
                {{ labelStatut(room.statut) }}
              </span>
              <button
                @click="goToDetails(room.id)"
                class="btn btn-outline"
                :class="{ 'btn--dimmed': !isAvailable(room) }"
              >
                {{ $t('rooms.view_details') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="rooms.length === 0" class="empty-state">
        {{ $t('rooms.none_available') }}
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
import ImageSlideshow from '@/components/ui/ImageSlideshow.vue'

import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()
const roomStore = useRoomStore()
const authStore = useAuthStore()
const { rooms, loading, error } = storeToRefs(roomStore)

// Une chambre est disponible uniquement si son statut est DISPONIBLE
function isAvailable(room) {
  return room.statut === 'DISPONIBLE'
}

// Libellé lisible pour chaque statut
function labelStatut(statut) {
  const labels = {
    DISPONIBLE:   t('status.available'),
    OCCUPEE:      t('status.occupied'),
    RESERVEE:     t('status.reserved'),
    EN_ATTENTE:   t('status.pending'),
    MAINTENANCE:  t('status.maintenance'),
    NETTOYAGE:    t('status.cleaning'),
  }
  return labels[statut] || statut
}

const disponibleCount = computed(() => rooms.value.filter(r => isAvailable(r)).length)
const occupeeCount    = computed(() => rooms.value.filter(r => !isAvailable(r)).length)

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
  max-width: 1100px;
  margin: 0 auto;
}

.section-padding {
  padding-top: var(--spacing-2xl);
  padding-bottom: var(--spacing-2xl);
}

.center-text { text-align: center; }

.page-title {
  font-size: 2.5rem;
  color: var(--color-primary);
  margin-bottom: var(--spacing-xs);
}

.subtitle {
  font-size: 1.1rem;
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-lg);
}

/* ── Résumé ─────────────────────────────────────────────────────────────── */
.rooms-summary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: var(--spacing-2xl);
  font-size: 0.9rem;
  color: var(--color-text-muted);
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.summary-sep {
  font-size: 1.2rem;
  opacity: 0.4;
}

.dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  flex-shrink: 0;
}
.dot-available { background: #22c55e; }
.dot-occupied  { background: #ef4444; }

/* ── Grid ────────────────────────────────────────────────────────────────── */
.rooms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--spacing-lg);
}

/* ── Room card ───────────────────────────────────────────────────────────── */
.room-card {
  background: white;
  border-radius: 1.25rem;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  transition: transform 0.25s, box-shadow 0.25s;
  display: flex;
  flex-direction: column;
  position: relative;
}

.room-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 36px rgba(0,0,0,0.13);
}

.room-card--occupied {
  opacity: 0.9;
}

/* ── Badge "Occupée" ────────────────────────────────────────────────────── */
.occupied-badge {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  padding: 0.45rem 0.9rem;
  animation: pulse-badge 2.5s ease-in-out infinite;
}

@keyframes pulse-badge {
  0%, 100% { background: linear-gradient(135deg, #ef4444, #dc2626); }
  50%       { background: linear-gradient(135deg, #f87171, #ef4444); }
}

/* ── Image ───────────────────────────────────────────────────────────────── */
.card-image-wrapper {
  position: relative;
  height: 230px;
  overflow: hidden;
}

.room-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s;
}

.room-card:hover .room-image {
  transform: scale(1.04);
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: rgba(220, 38, 38, 0.32);
  display: flex;
  align-items: center;
  justify-content: center;
}

.overlay-text {
  background: rgba(185, 28, 28, 0.85);
  color: white;
  font-weight: 700;
  font-size: 0.95rem;
  padding: 0.35rem 1rem;
  border-radius: 2rem;
  letter-spacing: 0.04em;
}

/* ── Infos ───────────────────────────────────────────────────────────────── */
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
  font-size: 1.2rem;
  color: var(--color-primary);
}

.room-price {
  font-weight: 700;
  color: var(--color-secondary);
  font-size: 1.05rem;
  white-space: nowrap;
}

.per-night {
  font-size: 0.78rem;
  color: var(--color-text-muted);
  font-weight: 400;
}

.room-meta {
  display: flex;
  gap: var(--spacing-md);
  font-size: 0.85rem;
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-sm);
}

.room-desc {
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-md);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  line-clamp: 3;
  overflow: hidden;
  flex: 1;
  font-size: 0.9rem;
}

/* ── Actions ─────────────────────────────────────────────────────────────── */
.card-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-top: auto;
}

.status-pill {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.28rem 0.75rem;
  border-radius: 2rem;
  white-space: nowrap;
}

.pill-available {
  background: #dcfce7;
  color: #16a34a;
}

.pill-occupied {
  background: #fee2e2;
  color: #dc2626;
}

.btn--dimmed {
  opacity: 0.65;
}

/* ── États ───────────────────────────────────────────────────────────────── */
.loading-state {
  text-align: center;
  padding: var(--spacing-2xl);
  color: var(--color-text-muted);
}

.loading-dots {
  display: flex;
  justify-content: center;
  gap: 0.4rem;
  margin-bottom: 1rem;
}

.loading-dots span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--color-primary);
  animation: bounce 1.2s infinite ease-in-out;
}
.loading-dots span:nth-child(2) { animation-delay: 0.2s; }
.loading-dots span:nth-child(3) { animation-delay: 0.4s; }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
  40%           { transform: scale(1.1); opacity: 1; }
}

.error-state {
  text-align: center;
  padding: var(--spacing-2xl);
  font-size: 1.2rem;
  color: var(--color-danger);
}

.empty-state {
  text-align: center;
  padding: var(--spacing-2xl);
  color: var(--color-text-muted);
}
</style>
