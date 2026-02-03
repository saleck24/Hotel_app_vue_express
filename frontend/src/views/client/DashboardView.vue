<template>
  <div class="dashboard-home">
    <div class="stats-grid">
      <div class="stat-card">
        <h3>Total des Réservations</h3>
        <p class="stat-value">{{ stats.total }}</p>
      </div>
       <div class="stat-card">
        <h3>Réservations EN_ATTENTE</h3>
        <p class="stat-value">{{ stats.pending }}</p>
      </div>
    </div>

    <div class="dashboard-content">
      <div class="recent-section">
        <h3>Activité Récente</h3>
        <div v-if="loading">Chargement...</div>
        <div v-else-if="recentReservations.length === 0">
          <p>Aucune activité récente.</p>
        </div>
        <div v-else class="recent-list">
          <div v-for="res in recentReservations" :key="res.id" class="recent-item">
            <span class="recent-type">{{ res.type }} (N° {{ res.numero }})</span>
            <span :class="['status-badge', res.statut?.toLowerCase()]">{{ res.statut }}</span>
            <span class="recent-date">{{ formatDate(res.date_debut) }}</span>
          </div>
        </div>
        <RouterLink to="/rooms" class="btn btn-primary btn-lg mt-6">Réserver une chambre</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '@/services/api'

const reservations = ref([])
const loading = ref(true)

const stats = computed(() => {
  return {
    total: reservations.value.length,
    pending: reservations.value.filter(r => r.statut === 'EN_ATTENTE').length
  }
})

const recentReservations = computed(() => {
  return reservations.value.slice(0, 5)
})

function formatDate(date) {
  return new Date(date).toLocaleDateString()
}

async function fetchStats() {
  loading.value = true
  try {
    const res = await api.get('/reservations/mes-reservations')
    reservations.value = res.data
  } catch (err) {
    console.error("Erreur chargement dashboard:", err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchStats)
</script>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.stat-card {
  background: var(--color-surface);
  padding: var(--spacing-xl);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  text-align: center;
  border: 1px solid rgba(0,0,0,0.05);
  transition: background-color 0.3s ease;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--color-primary);
  margin-top: var(--spacing-sm);
}

/* Fix primary color visibility in dark mode if needed */
:global(.dark) .stat-value {
  color: var(--color-secondary); /* Gold looks better on dark */
}

.recent-section {
  background: var(--color-surface);
  padding: var(--spacing-xl);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  border: 1px solid rgba(0,0,0,0.05);
  transition: background-color 0.3s ease;
}

/* Border adjustments for dark mode */
:global(.dark) .stat-card,
:global(.dark) .recent-section {
  border-color: rgba(255,255,255,0.1);
}

.recent-list {
  margin: var(--spacing-lg) 0;
}

.recent-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) 0;
  border-bottom: 1px solid rgba(0,0,0,0.05);
}

:global(.dark) .recent-item {
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.recent-item:last-child {
  border-bottom: none;
}

.recent-type {
  font-weight: 600;
  flex: 1;
  color: var(--color-text);
}

.recent-date {
  color: var(--color-text-muted);
  font-size: 0.9rem;
  margin-left: var(--spacing-md);
}

.status-badge {
  padding: 4px 10px;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

.en_attente { background-color: var(--color-warning); color: white; }
.confirmee { background-color: var(--color-success); color: white; }
.annulee { background-color: var(--color-danger); color: white; }

.mt-6 { margin-top: var(--spacing-xl); }

.btn-lg {
  width: 100%;
  padding: var(--spacing-md);
  font-size: 1.1rem;
}
</style>
