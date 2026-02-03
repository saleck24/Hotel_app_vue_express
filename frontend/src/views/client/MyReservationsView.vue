<template>
  <div class="my-reservations">
    <div v-if="loading">Chargement des réservations...</div>
    <div v-else-if="reservations.length === 0">
      <p>Vous n'avez pas encore de réservations.</p>
      <RouterLink to="/rooms" class="btn btn-primary mt-4">Trouver une chambre</RouterLink>
    </div>
    <div v-else class="reservations-list">
      <div v-for="res in reservations" :key="res.id" class="reservation-card">
        <div class="res-info">
          <div class="res-header">
             <h4>Réservation #{{ res.id }}</h4>
             <span :class="['status-badge', res.statut?.toLowerCase()]">{{ res.statut }}</span>
          </div>
          <div class="res-details">
            <p><strong>Chambre:</strong> {{ res.type }} (N° {{ res.numero }})</p>
            <p><strong>Dates:</strong> {{ formatDate(res.date_debut) }} - {{ formatDate(res.date_fin) }}</p>
          </div>
        </div>
        <div class="res-actions">
          <button 
            v-if="res.statut === 'EN_ATTENTE' || res.statut === 'CONFIRMEE'" 
            @click="cancelReservation(res.id)" 
            class="btn btn-danger btn-sm"
          >
            Annuler
          </button>
          <button
            v-if="res.statut === 'CONFIRMEE' && !hasReview(res.id)"
            @click="toggleReview(res.id)"
            class="btn btn-primary btn-sm"
          >
            Donner une note
          </button>
        </div>
        <div v-if="openReviewId === res.id && !hasReview(res.id)" class="review-form">
          <div class="review-row">
            <label for="note">Note (1-5)</label>
            <input
              id="note"
              type="number"
              min="1"
              max="5"
              v-model.number="reviewForm.note"
            />
          </div>
          <div class="review-row">
            <label for="commentaire">Commentaire (optionnel)</label>
            <textarea
              id="commentaire"
              rows="3"
              v-model="reviewForm.commentaire"
            ></textarea>
          </div>
          <div class="review-actions">
            <button
              class="btn btn-primary btn-sm"
              :disabled="reviewLoading"
              @click="submitReview(res.id)"
            >
              Envoyer
            </button>
            <button class="btn btn-secondary btn-sm" @click="toggleReview(null)">
              Fermer
            </button>
          </div>
          <p v-if="reviewError" class="error-text">{{ reviewError }}</p>
          <p v-if="reviewSuccessId === res.id" class="success-text">Merci pour votre avis.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const reservations = ref([])
const loading = ref(true)
const openReviewId = ref(null)
const reviewLoading = ref(false)
const reviewError = ref('')
const reviewSuccessId = ref(null)
const reviewForm = ref({
  note: 5,
  commentaire: ''
})
const reviewedReservationIds = ref(new Set())

function formatDate(date) {
  return new Date(date).toLocaleDateString()
}

async function fetchReservations() {
  loading.value = true
  try {
    const res = await api.get('/reservations/mes-reservations')
    reservations.value = res.data
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

async function fetchMyReviews() {
  try {
    const res = await api.get('/reviews/me')
    reviewedReservationIds.value = new Set(res.data.map(r => r.reservation_id))
  } catch (err) {
    console.error(err)
  }
}

async function cancelReservation(id) {
  if(!confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) return
  try {
    await api.put(`/reservations/${id}/annuler`)
    fetchReservations()
  } catch (err) {
    alert("Échec de l'annulation de la réservation")
  }
}


function hasReview(reservationId) {
  return reviewedReservationIds.value.has(reservationId)
}

function toggleReview(id) {
  if (openReviewId.value === id) {
    openReviewId.value = null
  } else {
    openReviewId.value = id
    reviewForm.value.note = 5
    reviewForm.value.commentaire = ''
    reviewError.value = ''
    reviewSuccessId.value = null
  }
}

async function submitReview(reservationId) {
  reviewLoading.value = true
  reviewError.value = ''
  
  try {
    await api.post('/reviews', {
      reservation_id: reservationId,
      note: reviewForm.value.note,
      commentaire: reviewForm.value.commentaire
    })
    
    // Success
    reviewSuccessId.value = reservationId
    reviewedReservationIds.value.add(reservationId)
    
    // Close form after short delay
    setTimeout(() => {
      openReviewId.value = null
      reviewSuccessId.value = null
    }, 2000)
    
  } catch (err) {
    reviewError.value = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Erreur lors de l\'envoi de l\'avis'
  } finally {
    reviewLoading.value = false
  }
}

onMounted(() => {
  fetchReservations()
  fetchMyReviews()
})
</script>

<style scoped>
.reservation-card {
  background: var(--color-surface);
  padding: var(--spacing-lg);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  margin-bottom: var(--spacing-md);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid rgba(0,0,0,0.05);
  transition: background-color 0.3s ease;
}

:global(.dark) .reservation-card {
  border: 1px solid rgba(255,255,255,0.1);
}

.res-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  margin-right: var(--spacing-xl);
}

.res-header {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.res-header h4 {
  color: var(--color-primary);
  font-weight: 700;
}

:global(.dark) .res-header h4 {
  color: var(--color-text);
}

.res-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: right;
  min-width: 250px;
  color: var(--color-text);
}

.res-actions {
  min-width: 80px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
}

.en_attente { background-color: var(--color-warning); color: white; }
.confirmee { background-color: var(--color-success); color: white; }
.annulee { background-color: var(--color-danger); color: white; }

.btn-sm {
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: 0.8rem;
}

.review-form {
  margin-top: 1rem;
  padding: 1rem;
  background: var(--color-background);
  border-radius: var(--radius-sm);
  width: 100%;
}

.review-row {
  margin-bottom: 1rem;
}

.review-row label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--color-text);
}

.review-row input, .review-row textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: 4px;
  background: var(--color-surface);
  color: var(--color-text);
}

:global(.dark) .review-row input, 
:global(.dark) .review-row textarea {
  border: 1px solid rgba(255,255,255,0.1);
}

.review-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}
</style>
