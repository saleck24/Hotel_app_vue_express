<template>
  <div class="reservations-manager">
    <div class="header">
      <h2 class="title">Gestion des réservations</h2>
    </div>

    <div class="tabs-container">
      <div class="tabs">
        <button :class="['tab', filter === 'EN_ATTENTE' ? 'active' : '']" @click="setFilter('EN_ATTENTE')">En attente</button>
        <button :class="['tab', filter === 'ALL' ? 'active' : '']" @click="setFilter('ALL')">Toutes</button>
      </div>
    </div>

    <div v-if="loading" class="loading">Chargement...</div>
    <div v-else class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Chambre</th>
            <th>Client</th>
            <th>Dates</th>
            <th>Total</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="res in filteredReservations" :key="res.id">
            <td>#{{ res.id }}</td>
            <td>{{ res.type }} (No. {{ res.numero }})</td>
            <td>{{ res.nom }}</td>
            <td>{{ formatDate(res.date_debut) }} - {{ formatDate(res.date_fin) }}</td>
            <td class="total-cell">{{ res.total }} MRU</td>
             <td><span :class="['status-text', getStatusColor(res.statut)]">{{ res.statut }}</span></td>
            <td>
              <div class="action-buttons">
                <button 
                  v-if="res.statut === 'EN_ATTENTE'" 
                  class="btn-admin btn-admin-validate" 
                  @click="validateReservation(res.id)"
                >
                  Valider
                </button>
                <button 
                  v-if="res.statut !== 'ANNULEE'"
                  class="btn-admin btn-admin-cancel" 
                  @click="cancelReservation(res.id)"
                >
                  Annuler
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '@/services/api'

const reservations = ref([])
const loading = ref(true)
const filter = ref('EN_ATTENTE')

const filteredReservations = computed(() => {
  if (filter.value === 'ALL') return reservations.value
  return reservations.value.filter(r => r.statut === filter.value)
})

async function fetchReservations() {
  loading.value = true
  try {
    // If filter is ALL, fetch from the new admin endpoint /api/reservations
    // If filter is EN_ATTENTE, we can still use /api/reservations/en-attente or filter the full list
    let endpoint = '/reservations/en-attente'
    if (filter.value === 'ALL') {
      endpoint = '/reservations'
    }
    const res = await api.get(endpoint)
    reservations.value = res.data
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

function setFilter(newFilter) {
  filter.value = newFilter
  fetchReservations()
}

async function validateReservation(id) {
  try {
    await api.put(`/reservations/${id}/valider`)
    fetchReservations()
  } catch (err) {
    alert('Failed to validate')
  }
}

async function cancelReservation(id) {
  if(!confirm('Annuler cette réservation ?')) return
  try {
    // Using the new admin-specific cancel endpoint
    await api.put(`/reservations/${id}/annuler-admin`)
    fetchReservations()
  } catch (err) {
    alert("Échec de l'annulation")
  }
}

function formatDate(date) {
  return new Date(date).toLocaleDateString()
}

function getStatusColor(status) {
  switch(status) {
    case 'CONFIRMEE': return 'success';
    case 'ANNULEE': return 'danger';
    default: return 'warning';
  }
}

onMounted(fetchReservations)
</script>

<style scoped>
.reservations-manager {
  padding: 1rem 0;
}

.header { 
  margin-bottom: var(--spacing-lg); 
}

.title {
  color: var(--color-primary);
  font-family: var(--font-heading);
}

:global(.dark) .title {
  color: var(--color-text);
}

.tabs-container {
  margin-bottom: var(--spacing-lg);
}

.tabs { 
  display: flex;
  gap: 10px;
}

.tab { 
  padding: 10px 20px; 
  border: 1px solid #ddd;
  background: white; 
  cursor: pointer; 
  border-radius: var(--radius-md);
  font-weight: 600;
  transition: all 0.3s;
  color: var(--color-text);
}

:global(.dark) .tab {
  background: var(--color-surface);
  border-color: rgba(255,255,255,0.1);
  color: var(--color-text-muted);
}

.tab.active { 
  background: var(--color-primary); 
  color: white; 
  border-color: var(--color-primary);
}

:global(.dark) .tab.active {
  background: var(--color-secondary);
  border-color: var(--color-secondary);
  color: white;
}

.table-container {
  background: white;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  overflow-x: auto;
  border: 1px solid #ddd;
}

:global(.dark) .table-container {
  background: var(--color-surface);
  border-color: rgba(255,255,255,0.1);
}

.data-table { 
  width: 100%; 
  border-collapse: collapse; 
  text-align: left; 
}

.data-table th, .data-table td { 
  padding: var(--spacing-md); 
  border: 1px solid #ddd; 
  color: var(--color-text);
}

:global(.dark) .data-table th, 
:global(.dark) .data-table td {
  border-color: rgba(255,255,255,0.1);
}

.data-table th {
  background-color: #f1f1f1;
  font-weight: 700;
  color: var(--color-primary);
  text-transform: uppercase;
  font-size: 0.85rem;
}

:global(.dark) .data-table th {
  background-color: rgba(0,0,0,0.2);
  color: var(--color-text);
}

.total-cell {
  font-weight: 700;
  color: var(--color-secondary);
}

.status-text {
  font-weight: 700;
  font-size: 0.85rem;
  text-transform: uppercase;
}

.success { color: var(--color-success); }
.danger { color: var(--color-danger); }
.warning { color: var(--color-warning); }

.action-buttons {
  display: flex;
  gap: 10px;
}

.btn-admin {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.85rem;
  transition: opacity 0.2s;
}

.btn-admin:hover {
  opacity: 0.8;
}

.btn-admin-validate {
  background-color: var(--color-success);
  color: white;
}

.btn-admin-cancel {
  background-color: var(--color-danger);
  color: white;
}

.loading {
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  color: var(--color-text-muted);
}
</style>
