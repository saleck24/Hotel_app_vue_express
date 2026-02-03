<template>
  <div class="admin-dashboard">
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Chargement des statistiques...</p>
    </div>
    
    <div v-else class="dashboard-content">
      <header class="dashboard-header">
        <h1>Tableau de Bord</h1>
        <p>Résumé de l'activité de votre hôtel</p>
      </header>

      <div class="stats-grid">
        <!-- Revenu -->
        <div class="stat-card revenue">
          <div class="stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
          </div>
          <div class="stat-info">
            <h3>Revenu total</h3>
            <p class="stat-value">{{ formatCurrency(stats.revenue) }}</p>
            <span class="stat-sub">Réservations confirmées</span>
          </div>
        </div>

        <!-- Occupation -->
        <div class="stat-card occupancy">
          <div class="stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 20v-8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8"></path><path d="M5 10V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4"></path><path d="M3 18h18"></path></svg>
          </div>
          <div class="stat-info">
            <h3>Occupation</h3>
            <p class="stat-value">{{ stats.occupancy.rate }}%</p>
            <span class="stat-sub">{{ stats.occupancy.occupied }} / {{ stats.occupancy.total }} chambres</span>
          </div>
        </div>

        <!-- Réservations en attente -->
        <div class="stat-card pending">
          <div class="stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          </div>
          <div class="stat-info">
            <h3>À valider</h3>
            <p class="stat-value">{{ stats.pendingReservations }}</p>
            <RouterLink to="/admin/reservations" class="action-btn">
              Gérer les réservations
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </RouterLink>
          </div>
        </div>

        <!-- Note moyenne -->
        <div class="stat-card rating">
          <div class="stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
          </div>
          <div class="stat-info">
            <h3>Note moyenne</h3>
            <p class="stat-value">{{ stats.reviews.averageRating }}<span class="out-of">/5</span></p>
            <RouterLink to="/admin/reviews" class="action-btn">
              Voir les avis
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </RouterLink>
          </div>
        </div>

        <!-- Accès Chambres -->
        <div class="stat-card link-card rooms-link">
          <div class="stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          </div>
          <div class="stat-info">
            <h3>Chambres</h3>
            <p class="card-desc">Gérez votre inventaire et les tarifs</p>
            <RouterLink to="/admin/rooms" class="action-btn secondary">
              Accéder au gestionnaire
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </RouterLink>
          </div>
        </div>

        <!-- Accès Utilisateurs -->
        <div class="stat-card link-card users-link">
          <div class="stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          </div>
          <div class="stat-info">
            <h3>Utilisateurs</h3>
            <p class="card-desc">Gérez les comptes clients et admin</p>
            <RouterLink to="/admin/users" class="action-btn secondary">
              Liste des membres
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const stats = ref({
  revenue: 0,
  pendingReservations: 0,
  occupancy: { rate: 0, occupied: 0, total: 0 },
  reviews: { averageRating: 0, totalCount: 0 }
})
const loading = ref(true)

async function fetchStats() {
  try {
    const res = await api.get('/stats/dashboard')
    stats.value = res.data
  } catch (err) {
    console.error('Failed to fetch dashboard stats:', err)
  } finally {
    loading.value = false
  }
}

function formatCurrency(value) {
  return `${parseFloat(value).toLocaleString()} MRU`
}

onMounted(fetchStats)
</script>

<style scoped>
.admin-dashboard {
  padding: var(--spacing-md);
}

.dashboard-header {
  margin-bottom: var(--spacing-xl);
}

.dashboard-header h1 {
  font-size: 1.875rem;
  font-weight: 800;
  color: var(--color-text); /* Adaptive */
  letter-spacing: -0.025em;
  margin-bottom: 0.25rem;
}

.dashboard-header p {
  color: var(--color-text-muted);
  font-size: 1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
}

.stat-card {
  background: var(--color-surface);
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: flex-start;
  gap: 1.25rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(0,0,0,0.05);
}

:global(.dark) .stat-card {
  border: 1px solid rgba(255,255,255,0.1);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.stat-icon {
  width: 3.5rem;
  height: 3.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.75rem;
  flex-shrink: 0;
}

/* Colors for icons - adjust backgrounds for dark mode or keep as is (they are light pastels) */
.revenue .stat-icon { background: #ecfdf5; color: #059669; }
.occupancy .stat-icon { background: #eff6ff; color: #2563eb; }
.pending .stat-icon { background: #fffbeb; color: #d97706; }
.rating .stat-icon { background: #fef2f2; color: #dc2626; }
.rooms-link .stat-icon { background: #f5f3ff; color: #7c3aed; }
.users-link .stat-icon { background: #fdf2f8; color: #db2777; }

:global(.dark) .revenue .stat-icon { background: rgba(5, 150, 105, 0.2); }
:global(.dark) .occupancy .stat-icon { background: rgba(37, 99, 235, 0.2); }
:global(.dark) .pending .stat-icon { background: rgba(217, 119, 6, 0.2); }
:global(.dark) .rating .stat-icon { background: rgba(220, 38, 38, 0.2); }
:global(.dark) .rooms-link .stat-icon { background: rgba(124, 58, 237, 0.2); }
:global(.dark) .users-link .stat-icon { background: rgba(219, 39, 119, 0.2); }

.stat-info {
  flex: 1;
}

.stat-info h3 {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--color-text); /* Adaptive */
  line-height: 1;
  margin-bottom: 0.5rem;
}

.out-of {
  font-size: 1rem;
  color: var(--color-text-muted);
  margin-left: 2px;
}

.stat-sub, .card-desc {
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.5rem 0.75rem;
  background-color: var(--color-background);
  color: var(--color-text);
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
  border: 1px solid rgba(0,0,0,0.1);
}

.action-btn:hover {
  background-color: var(--color-surface);
  border-color: var(--color-text-muted);
}

.action-btn.secondary {
  background-color: var(--color-surface);
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
}

.spinner {
  width: 2.5rem;
  height: 2.5rem;
  border: 4px solid #f3f4f6;
  border-top: 4px solid #c5a059;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 640px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
