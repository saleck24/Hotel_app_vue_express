<template>
  <div class="home-view">
    <!-- ─── HERO ─────────────────────────────────────────────────────────── -->
    <section class="hero">
      <div class="hero-content container">
        <h1 class="hero-title playfair">
          {{ $t('home.hero_title') }}
        </h1>
        <p class="hero-subtitle">
          {{ $t('home.hero_subtitle') }}
        </p>
        <RouterLink to="/rooms" class="btn btn-secondary btn-lg">{{ $t('home.browse_rooms') }}</RouterLink>
      </div>
    </section>

    <!-- ─── FILTRE DISPONIBILITÉ ─────────────────────────────────────────── -->
    <section class="availability-section">
      <div class="container availability-inner">
        <div class="availability-card">
          <div class="availability-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <h2 class="availability-title">{{ $t('home.check_availability') }}</h2>
          <p class="availability-subtitle">{{ $t('home.availability_hint') }}</p>

          <div class="date-picker-row">
            <div class="date-field">
              <label for="date-debut">{{ $t('home.arrival') }}</label>
              <input
                id="date-debut"
                type="date"
                v-model="dateDebut"
                :min="today"
                class="date-input"
              />
            </div>
            <div class="date-separator">→</div>
            <div class="date-field">
              <label for="date-fin">{{ $t('home.departure') }}</label>
              <input
                id="date-fin"
                type="date"
                v-model="dateFin"
                :min="dateDebut || today"
                class="date-input"
              />
            </div>
            <button type="submit" class="btn-check" @click="checkAvailability" :disabled="!canCheck || checkLoading">
              <span v-if="!checkLoading">{{ $t('home.check_availability') }}</span>
              <span v-else class="btn-spinner"></span>
            </button>
          </div>

          <div v-if="dateError" class="date-error">{{ dateError }}</div>

          <!-- Légende -->
          <div v-if="availabilityChecked" class="legend">
            <span class="legend-item"><span class="dot dot-available"></span> {{ $t('home.available') }}</span>
            <span class="legend-item"><span class="dot dot-occupied"></span> {{ $t('home.occupied') }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── CHAMBRES VEDETTES ─────────────────────────────────────────────── -->
    <section class="featured-rooms section-padding">
      <div class="container featured-rooms-inner">
        <div class="section-header">
          <h2 class="section-title playfair">{{ $t('home.featured_rooms') }}</h2>
          <p class="section-subtitle">
            <template v-if="availabilityChecked">
              {{ $t('home.results_for') }} <strong>{{ formatDate(dateDebut) }}</strong> {{ $t('home.to') }} <strong>{{ formatDate(dateFin) }}</strong>
            </template>
            <template v-else>{{ $t('home.selected_for_comfort') }}</template>
          </p>
        </div>

        <div v-if="loading || checkLoading" class="loading-state">
          <div class="loading-dots"><span></span><span></span><span></span></div>
          <p>Chargement des chambres...</p>
        </div>

        <div v-else class="rooms-grid">
          <div
            v-for="room in displayedRooms"
            :key="room.id"
            class="room-card"
            :class="{ 'room-card--occupied': room.estOccupee }"
          >
            <!-- Badge "Occupé" -->
            <div v-if="room.estOccupee" class="occupied-badge">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              Occupé du {{ formatDate(dateDebut) }} au {{ formatDate(dateFin) }}
            </div>

            <!-- Image avec slideshow -->
            <div class="room-image-wrapper">
              <ImageSlideshow :images="room.images" />
              <div v-if="room.estOccupee" class="image-overlay">
                <span class="overlay-text">Non disponible</span>
              </div>
            </div>

            <div class="room-info">
              <div class="room-header">
                <h3 class="room-type">{{ room.type }}</h3>
                <span class="room-price">{{ room.prix }} MRU <span class="per-night">/ nuit</span></span>
              </div>
              <p class="room-desc">{{ room.description }}</p>

              <div class="room-footer">
                <div class="room-status-pill" :class="room.estOccupee ? 'pill-occupied' : 'pill-available'">
                  {{ room.estOccupee ? 'Indisponible' : 'Disponible' }}
                </div>
                <RouterLink :to="`/rooms/${room.id}`" class="btn btn-outline btn-md">Voir Détails</RouterLink>
              </div>
            </div>
          </div>
        </div>

        <div v-if="!loading && !checkLoading && displayedRooms.length === 0" class="empty-state">
          <p>Aucune chambre trouvée.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoomStore } from '@/stores/rooms'
import { storeToRefs } from 'pinia'
import ImageSlideshow from '@/components/ui/ImageSlideshow.vue'
import api from '@/services/api'

const roomStore = useRoomStore()
const { rooms, loading } = storeToRefs(roomStore)

// ── Dates ────────────────────────────────────────────────────────────────────
const today = new Date().toISOString().split('T')[0]
const dateDebut = ref('')
const dateFin = ref('')
const dateError = ref('')

// ── Disponibilité ────────────────────────────────────────────────────────────
const checkLoading = ref(false)
const availabilityChecked = ref(false)
const availabilityRooms = ref([])

const canCheck = computed(() => dateDebut.value && dateFin.value && dateFin.value > dateDebut.value)

async function checkAvailability() {
  dateError.value = ''
  if (!canCheck.value) {
    dateError.value = 'Veuillez sélectionner des dates valides (départ après arrivée).'
    return
  }
  checkLoading.value = true
  availabilityChecked.value = false
  try {
    const { data } = await api.get('/rooms/availability', {
      params: { date_debut: dateDebut.value, date_fin: dateFin.value }
    })
    availabilityRooms.value = data
    availabilityChecked.value = true
  } catch (err) {
    dateError.value = 'Erreur lors de la vérification. Veuillez réessayer.'
  } finally {
    checkLoading.value = false
  }
}

// ── Chambres affichées ───────────────────────────────────────────────────────
const displayedRooms = computed(() => {
  if (availabilityChecked.value) {
    // Avec une période : disponibles en premier, occupées ensuite
    const sorted = [...availabilityRooms.value].sort((a, b) => {
      if (a.estOccupee === b.estOccupee) return 0
      return a.estOccupee ? 1 : -1
    })
    return sorted.slice(0, 3)
  }
  // Sans filtre : toutes les chambres (disponibles en premier), max 3
  const sorted = [...rooms.value].sort((a, b) => {
    const aScore = a.statut === 'DISPONIBLE' ? 0 : 1
    const bScore = b.statut === 'DISPONIBLE' ? 0 : 1
    return aScore - bScore
  })
  return sorted.slice(0, 3)
})

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

onMounted(() => {
  roomStore.fetchRooms()
})
</script>

<style scoped>
/* ── HERO ─────────────────────────────────────────────────────────────────── */
.hero {
  background-image: linear-gradient(rgba(26, 42, 68, 0.7), rgba(26, 42, 68, 0.7)),
    url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80');
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

/* ── AVAILABILITY SECTION ─────────────────────────────────────────────────── */
.availability-section {
  background: linear-gradient(135deg, #f8f5ff 0%, #eef4ff 100%);
  padding: 3.5rem 0;
}

.availability-inner {
  max-width: 900px;
  margin: 0 auto;
}

.availability-card {
  background: white;
  border-radius: 1.5rem;
  padding: 2.5rem 3rem;
  box-shadow: 0 8px 40px rgba(100, 80, 200, 0.1);
  text-align: center;
}

.availability-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, var(--color-primary), #7c6fe0);
  border-radius: 50%;
  color: white;
  margin-bottom: 1rem;
}

.availability-title {
  font-family: var(--font-heading);
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 0.4rem;
}

.availability-subtitle {
  color: var(--color-text-muted);
  margin-bottom: 1.75rem;
  font-size: 0.95rem;
}

.date-picker-row {
  display: flex;
  align-items: flex-end;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.date-field {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.4rem;
}

.date-field label {
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-muted);
}

.date-input {
  padding: 0.65rem 1rem;
  border: 1.5px solid #ddd;
  border-radius: 0.75rem;
  font-size: 1rem;
  color: var(--color-primary);
  font-family: inherit;
  cursor: pointer;
  transition: border-color 0.2s;
  min-width: 170px;
}

.date-input:focus {
  outline: none;
  border-color: var(--color-secondary);
  box-shadow: 0 0 0 3px rgba(var(--color-secondary-rgb, 100, 160, 255), 0.15);
}

.date-separator {
  font-size: 1.5rem;
  color: var(--color-text-muted);
  padding-bottom: 0.5rem;
}

.btn-check {
  padding: 0.65rem 1.75rem;
  font-size: 1rem;
  border-radius: 0.75rem;
  min-width: 130px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  height: 46px;
}

.btn-check:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Spinner */
.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2.5px solid rgba(255,255,255,0.4);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.date-error {
  margin-top: 0.75rem;
  color: #e05252;
  font-size: 0.88rem;
}

/* Légende */
.legend {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  margin-top: 1.25rem;
}
.legend-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  color: var(--color-text-muted);
}
.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}
.dot-available { background: #22c55e; }
.dot-occupied  { background: #ef4444; }

/* ── FEATURED ROOMS ───────────────────────────────────────────────────────── */
.featured-rooms-inner {
  max-width: 1100px;
  margin: 0 auto;
}

.section-padding {
  padding: 6rem 0;
}

.section-header {
  text-align: center;
  margin-bottom: 3.5rem;
}

.section-title {
  font-family: var(--font-heading);
  font-size: 3rem;
  font-weight: 800;
  color: var(--color-primary);
  margin-bottom: var(--spacing-sm);
  letter-spacing: -0.01em;
}

.section-subtitle {
  color: var(--color-text-muted);
  font-size: 1rem;
}

/* Grid */
.rooms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-lg);
  justify-content: center;
}

/* ── ROOM CARD ───────────────────────────────────────────────────────────── */
.room-card {
  background: white;
  border-radius: 1.25rem;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  transition: transform 0.25s, box-shadow 0.25s;
  position: relative;
}

.room-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.13);
}

/* Occupied card dim */
.room-card--occupied {
  opacity: 0.88;
}

/* ── OCCUPIED BADGE ─────────────────────────────────────────────────────── */
.occupied-badge {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  padding: 0.5rem 0.9rem;
  border-bottom: none;
  animation: pulse-badge 2s ease-in-out infinite;
}

@keyframes pulse-badge {
  0%, 100% { background: linear-gradient(135deg, #ef4444, #dc2626); }
  50%       { background: linear-gradient(135deg, #f87171, #ef4444); }
}

/* Image */
.room-image-wrapper {
  position: relative;
  overflow: hidden;
}

.room-image {
  width: 100%;
  height: 200px;
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
  background: rgba(220, 38, 38, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
}

.overlay-text {
  background: rgba(220, 38, 38, 0.85);
  color: white;
  font-weight: 700;
  font-size: 1rem;
  padding: 0.4rem 1rem;
  border-radius: 2rem;
  letter-spacing: 0.04em;
}

/* Info */
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
  font-size: 1.2rem;
  color: var(--color-primary);
}

.room-price {
  font-weight: 700;
  color: var(--color-secondary);
  white-space: nowrap;
}

.per-night {
  font-size: 0.78rem;
  color: var(--color-text-muted);
  font-weight: 400;
}

.room-desc {
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-md);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-clamp: 2; /* Standard property for future compatibility */
  overflow: hidden;
  font-size: 0.9rem;
}

.room-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

/* Status pill */
.room-status-pill {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.28rem 0.75rem;
  border-radius: 2rem;
}

.pill-available {
  background: #dcfce7;
  color: #16a34a;
}

.pill-occupied {
  background: #fee2e2;
  color: #dc2626;
}

/* ── LOADING ──────────────────────────────────────────────────────────────── */
.loading-state {
  text-align: center;
  padding: 3rem;
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

.empty-state {
  text-align: center;
  padding: 2rem;
  color: var(--color-text-muted);
}

/* ── RESPONSIVE ───────────────────────────────────────────────────────────── */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .availability-card {
    padding: 1.75rem 1.25rem;
  }

  .date-picker-row {
    flex-direction: column;
    align-items: stretch;
  }

  .date-separator {
    display: none;
  }

  .date-input {
    width: 100%;
    min-width: unset;
  }

  .btn-check {
    width: 100%;
  }
}
</style>
