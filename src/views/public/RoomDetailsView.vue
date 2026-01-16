<template>
  <div class="room-details container section-padding">
    <div v-if="loading" class="text-center">Loading...</div>
    <div v-else-if="error" class="text-center error">{{ error }}</div>
    <div v-else-if="currentRoom" class="room-content">
      
      <div class="room-gallery">
        <img :src="currentRoom.images?.[0] || 'https://placehold.co/800x500?text=Room'" :alt="currentRoom.type" class="main-image">
        <!-- Add more images grid if available -->
      </div>

      <div class="room-info-grid">
        <div class="info-column">
          <h1 class="text-heading room-title">{{ currentRoom.type }}</h1>
          <p class="room-ref">Room #{{ currentRoom.numero }}</p>
          
          <div class="room-specs">
            <span class="spec-item">Capacity: {{ currentRoom.capacite }} Person(s)</span>
            <span class="spec-item">Status: <span :class="statusClass">{{ currentRoom.statut }}</span></span>
          </div>

          <div class="room-description">
            <h3>Description</h3>
            <p>{{ currentRoom.description }}</p>
          </div>

          <div class="price-tag">
            ${{ currentRoom.prix }} <span class="per-night">/ night</span>
          </div>
        </div>

        <div class="booking-column">
          <div class="booking-card">
            <h3>Book this Room</h3>
            <form @submit.prevent="handleBooking">
              <BaseInput
                 id="date-start"
                 label="Check-in Date"
                 type="date"
                 v-model="bookingForm.date_debut"
                 required
                 :min="today"
              />
              <BaseInput
                 id="date-end"
                 label="Check-out Date"
                 type="date"
                 v-model="bookingForm.date_fin"
                 required
                 :min="bookingForm.date_debut || today"
              />
              
              <div v-if="!isAuthenticated" class="auth-notice">
                <p>Please <RouterLink to="/login">login</RouterLink> to book this room.</p>
              </div>
              
              <BaseButton 
                v-else
                type="submit" 
                class="w-full" 
                :loading="bookingLoading"
                :disabled="currentRoom.statut !== 'DISPONIBLE'"
              >
                {{ currentRoom.statut === 'DISPONIBLE' ? 'Confirm Reservation' : 'Unavailable' }}
              </BaseButton>

              <p v-if="bookingError" class="error-msg">{{ bookingError }}</p>
              <p v-if="bookingSuccess" class="success-msg">Reservation request sent! View in Dashboard.</p>
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

onMounted(() => {
  roomStore.fetchRoom(route.params.id)
})
</script>

<style scoped>
.section-padding {
  padding-top: var(--spacing-2xl);
  padding-bottom: var(--spacing-2xl);
}

.room-gallery .main-image {
  width: 100%;
  height: 500px;
  object-fit: cover;
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-xl);
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

@media (max-width: 768px) {
  .room-info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
