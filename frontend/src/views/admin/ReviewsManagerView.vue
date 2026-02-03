<template>
  <div class="reviews-manager">
    <header class="view-header">
      <h1>Gestion des Avis</h1>
      <p>Consultez les retours d'expérience de vos clients</p>
    </header>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Chargement des avis...</p>
    </div>

    <div v-else-if="reviews.length === 0" class="empty-state">
      <p>Aucun avis n'a été publié pour le moment.</p>
    </div>

    <div v-else class="reviews-grid">
      <div v-for="review in reviews" :key="review.id" class="review-card">
        <div class="review-header">
          <div class="user-info">
            <span class="user-name">{{ review.utilisateur }}</span>
            <span class="review-date">{{ formatDate(review.date_review) }}</span>
          </div>
          <div class="rating-stars">
            <span v-for="n in 5" :key="n" :class="['star', n <= review.note ? 'filled' : '']">★</span>
          </div>
        </div>
        
        <div class="room-info">
          <span class="room-badge">Chambre {{ review.chambre_numero }} ({{ review.chambre_type }})</span>
        </div>

        <p class="review-comment">{{ review.commentaire || 'Aucun commentaire laissé.' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const reviews = ref([])
const loading = ref(true)

async function fetchReviews() {
  try {
    const res = await api.get('/reviews')
    reviews.value = res.data
  } catch (err) {
    console.error('Erreur lors de la récupération des avis:', err)
  } finally {
    loading.value = false
  }
}

function formatDate(dateStr) {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
  return new Date(dateStr).toLocaleDateString('fr-FR', options)
}

onMounted(fetchReviews)
</script>

<style scoped>
.view-header {
  margin-bottom: 2rem;
}

.view-header h1 {
  font-size: 1.875rem;
  font-weight: 800;
  color: var(--color-primary);
  margin-bottom: 0.25rem;
}

:global(.dark) .view-header h1 {
  color: var(--color-text);
}

.view-header p {
  color: var(--color-text-muted);
}

.reviews-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.review-card {
  background: var(--color-surface);
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  border: 1px solid rgba(0,0,0,0.05);
  transition: background-color 0.3s ease;
}

:global(.dark) .review-card {
  border: 1px solid rgba(255,255,255,0.1);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 700;
  color: var(--color-text);
}

.review-date {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}

.rating-stars {
  color: #e5e7eb;
  font-size: 1.25rem;
}

:global(.dark) .rating-stars {
  color: #4b5563;
}

.star.filled {
  color: #fbbf24;
}

.room-info {
  margin-bottom: 1rem;
}

.room-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #f3f4f6;
  color: #4b5563;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

:global(.dark) .room-badge {
  background: #374151;
  color: #e5e7eb;
}

.review-comment {
  color: var(--color-text);
  line-height: 1.5;
  font-style: italic;
}

.loading-state, .empty-state {
  text-align: center;
  padding: 4rem;
  color: var(--color-text-muted);
}

.spinner {
  width: 2.5rem;
  height: 2.5rem;
  border: 4px solid #f3f4f6;
  border-top: 4px solid #c5a059;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
