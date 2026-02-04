<template>
  <div class="room-details container section-padding">
    <div v-if="loading" class="text-center">Chargement...</div>
    <div v-else-if="error" class="text-center error">{{ error }}</div>
    <div v-else-if="currentRoom" class="room-content">
      
      <div class="room-gallery">
        <div class="images-row">
          <img 
            v-for="(image, index) in roomImages" 
            :key="index"
            :src="image" 
            :alt="`${currentRoom.type} - Image ${index + 1}`" 
            class="gallery-image"
          >
        </div>
      </div>

      <div class="room-info-grid">
        <div class="info-column">
          <h1 class="text-heading room-title">{{ currentRoom.type }}</h1>
          <p class="room-ref">Room #{{ currentRoom.numero }}</p>
          
          <div class="room-specs">
            <span class="spec-item">Capacité: {{ currentRoom.capacite }} Personne(s)</span>
            <span class="spec-item">Statut: <span :class="statusClass">{{ currentRoom.statut }}</span></span>
          </div>

          <div class="room-description">
            <h3>Description</h3>
            <p>{{ currentRoom.description }}</p>
          </div>

          <div class="price-tag">
            {{ currentRoom.prix }} MRU <span class="per-night">/ nuit</span>
          </div>
        </div>

        <div class="booking-column">
          <div class="booking-card">
            <h3>Réserver cette chambre</h3>
            <form @submit.prevent="handleBooking">
              <BaseInput
                 id="date-start"
                 label="Date d'arrivée"
                 type="date"
                 v-model="bookingForm.date_debut"
                 required
                 :min="today"
              />
              <BaseInput
                 id="date-end"
                 label="Date de départ"
                 type="date"
                 v-model="bookingForm.date_fin"
                 required
                 :min="bookingForm.date_debut || today"
              />
              
              <div v-if="!isAuthenticated" class="auth-notice">
                <p>Veuillez vous <RouterLink to="/login">connecter</RouterLink> pour réserver cette chambre.</p>
              </div>
              
              <BaseButton 
                v-else
                type="submit" 
                class="w-full" 
                :loading="bookingLoading"
                :disabled="currentRoom.statut !== 'DISPONIBLE'"
              >
                {{ currentRoom.statut === 'DISPONIBLE' ? 'Confirmer la réservation' : 'Indisponible' }}
              </BaseButton>

              <p v-if="bookingError" class="error-msg">{{ bookingError }}</p>
              <p v-if="bookingSuccess" class="success-msg">Demande de réservation envoyée à l'admin !</p>
              <a v-if="bookingSuccess"
                :href="whatsappLink"
                target="_blank"
                class="whatsapp-btn"
              >
                Contacter Admin sur WhatsApp
              </a>
            </form>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useRoomStore } from '@/stores/rooms'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import api from '@/services/api'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const route = useRoute()
const roomStore = useRoomStore()
const authStore = useAuthStore()

const { currentRoom, loading, error } = storeToRefs(roomStore)
const { isAuthenticated } = storeToRefs(authStore)

const bookingForm = ref({
  date_debut: '',
  date_fin: ''
})
const bookingLoading = ref(false)
const bookingError = ref('')
const bookingSuccess = ref(false)

const today = new Date().toISOString().split('T')[0]

const statusClass = computed(() => {
  return currentRoom.value?.statut === 'DISPONIBLE' ? 'text-success' : 'text-danger'
})

async function handleBooking() {
  if (!isAuthenticated.value) return
  bookingLoading.value = true
  bookingError.value = ''
  bookingSuccess.value = false

  try {
    await api.post('/reservations', {
      chambre_id: currentRoom.value.id, // Ensure ID is passed correctly (int vs string)
      ...bookingForm.value
    })
    bookingSuccess.value = true
  } catch (err) {
    bookingError.value = err.response?.data?.message || 'Booking failed.'
  } finally {
    bookingLoading.value = false
  }
}

const roomImages = computed(() => {
  if (!currentRoom.value || !currentRoom.value.images) {
    return ['https://placehold.co/400x300?text=Room']
  }
  const images = currentRoom.value.images.filter(img => img && img !== 'https://placehold.co/600x400?text=Room')
  return images.length > 0 ? images : ['https://placehold.co/400x300?text=Room']
})
const totalPrice = computed(() => {
  if (!bookingForm.value.date_debut || !bookingForm.value.date_fin || !currentRoom.value) return 0
  
  const start = new Date(bookingForm.value.date_debut)
  const end = new Date(bookingForm.value.date_fin)
  const diffTime = end - start
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return days > 0 ? days * currentRoom.value.prix : 0
})

const whatsappLink = computed(() => {
  if (!currentRoom.value) return '#'

  const message = `Bonjour, j'ai effectué une réservation de la chambre N°${currentRoom.value.numero} pendant la période ${bookingForm.value.date_debut} / ${bookingForm.value.date_fin} d'un montant de ${totalPrice.value} MRU`

  return `https://wa.me/22243455259?text=${encodeURIComponent(message)}`
})


onMounted(() => {
  roomStore.fetchRoom(route.params.id)
})
</script>

<style scoped>
.section-padding {
  padding-top: var(--spacing-2xl);
  padding-bottom: var(--spacing-2xl);
}

.room-gallery {
  margin-bottom: var(--spacing-xl);
}

.images-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-md);
  padding-left: 2rem;
}

.gallery-image {
  width: 100%;
  height: 280px;
  object-fit: cover;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  transition: transform 0.2s;
}

.gallery-image:hover {
  transform: scale(1.02);
  box-shadow: var(--shadow-md);
}

.room-info-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--spacing-2xl);
}

.room-title {
  font-size: 2.5rem;
  color: var(--color-primary);
  margin-bottom: var(--spacing-xs);
}

.room-ref {
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-md);
}

.room-specs {
  display: flex;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
  font-weight: 500;
}

.text-success { color: var(--color-success); }
.text-danger { color: var(--color-danger); }

.room-description h3 {
  font-size: 1.5rem;
  margin-bottom: var(--spacing-sm);
  color: var(--color-primary);
}

.room-description p {
  color: var(--color-text);
  line-height: 1.7;
  margin-bottom: var(--spacing-xl);
}

.price-tag {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-secondary);
  font-family: var(--font-heading);
}

.booking-card {
  background: white;
  padding: var(--spacing-xl);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  border: 1px solid #eee;
  position: sticky;
  top: 100px;
}

.booking-card h3 {
  margin-bottom: var(--spacing-lg);
  color: var(--color-primary);
}

.auth-notice {
  background: var(--color-accent);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  text-align: center;
  margin-bottom: var(--spacing-md);
}

.auth-notice a {
  color: var(--color-primary);
  font-weight: bold;
}

.error-msg {
  color: var(--color-danger);
  margin-top: var(--spacing-sm);
  text-align: center;
}

.success-msg {
  color: var(--color-success);
  margin-top: var(--spacing-sm);
  text-align: center;
  font-weight: 600;
}

.w-full { width: 100%; }

.info-column {
  padding-left: 2rem;
}
.whatsapp-btn {
  display: block;
  margin-top: var(--spacing-md);
  background: #25D366;
  color: white;
  text-align: center;
  padding: 12px;
  border-radius: var(--radius-md);
  font-weight: 600;
  text-decoration: none;
  transition: 0.2s;
}

.whatsapp-btn:hover {
  background: #1ebe5d;
}


@media (max-width: 768px) {
  .room-info-grid {
    grid-template-columns: 1fr;
  }
  .info-column {
    padding-left: 0;
  }
  .images-row {
    padding-left: 0;
  }
}
</style>
