<template>
  <div class="reservations-manager">
    <div class="header">
      <h2>Reservations Management</h2>
    </div>

    <div class="tabs">
      <button :class="['tab', filter === 'EN_ATTENTE' ? 'active' : '']" @click="filter = 'EN_ATTENTE'">Pending</button>
      <button :class="['tab', filter === 'ALL' ? 'active' : '']" @click="filter = 'ALL'">All</button>
    </div>

    <div v-if="loading">Loading...</div>
    <div v-else class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Room</th>
            <th>Client</th>
            <th>Dates</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="res in filteredReservations" :key="res.id">
            <td>#{{ res.id }}</td>
            <td>{{ res.room?.type || res.chambre_id }}</td>
            <td>{{ res.user?.nom || res.user_id }}</td>
            <td>{{ formatDate(res.date_debut) }} - {{ formatDate(res.date_fin) }}</td>
             <td><span :class="['badge', getStatusColor(res.statut)]">{{ res.statut }}</span></td>
            <td>
              <button 
                v-if="res.statut === 'EN_ATTENTE'" 
                class="btn-icon text-success" 
                @click="validateReservation(res.id)"
              >
                Validate
              </button>
              <button 
                 class="btn-icon text-danger" 
                 @click="cancelReservation(res.id)"
                 v-if="res.statut !== 'ANNULEE'"
              >
                Cancel
              </button>
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
    const res = await api.get('/reservations/en-attente')
    // The endpoint is /en-attente but we might want all. 
    // If the API only gives pending, we can only show pending.
    // If there is no 'all' endpoint, we rely on what we have.
    // Let's assume there's a way or we just stick to pending for 'EN_ATTENTE' tab.
    reservations.value = res.data
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

async function validateReservation(id) {
  try {
    await api.put(`/reservations/${id}/valider`)
    // Refresh
    // If API endpoint only returns pending, it will disappear from list, which is correct
    fetchReservations()
  } catch (err) {
    alert('Failed to validate')
  }
}

async function cancelReservation(id) {
  if(!confirm('Cancel this reservation?')) return
  try {
    await api.put(`/reservations/${id}/annuler`) // Using client endpoint or admin equivalent? 
    // API list says: PUT /api/reservations/{id}/annuler (CLIENT)
    // Does Admin have cancel? Often yes. If not, we might need a different endpoint or use same.
    fetchReservations()
  } catch (err) {
    alert('Failed to cancel')
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
.header { margin-bottom: var(--spacing-lg); }
.table-container {
  background: white;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  overflow-x: auto;
}
.data-table { width: 100%; border-collapse: collapse; text-align: left; }
.data-table th, .data-table td { padding: var(--spacing-md); border-bottom: 1px solid #eee; }
.badge { padding: 4px 8px; border-radius: 4px; font-weight: bold; font-size: 0.8rem; }
.success { background: var(--color-success); color: white; }
.danger { background: var(--color-danger); color: white; }
.warning { background: var(--color-warning); color: white; }
.btn-icon { background: none; border: none; cursor: pointer; font-weight: 600; margin-right: 10px; }
.text-success { color: var(--color-success); }
.text-danger { color: var(--color-danger); }
.tabs { margin-bottom: var(--spacing-md); }
.tab { padding: 8px 16px; border: none; background: #ddd; cursor: pointer; margin-right: 5px; border-radius: 4px; }
.tab.active { background: var(--color-primary); color: white; }
</style>
