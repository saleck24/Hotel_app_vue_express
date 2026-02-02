<template>
  <div class="my-reservations">
    <div v-if="loading">Loading reservations...</div>
    <div v-else-if="reservations.length === 0">
      <p>You have no reservations yet.</p>
      <RouterLink to="/rooms" class="btn btn-primary mt-4">Find a Room</RouterLink>
    </div>
    <div v-else class="reservations-list">
      <div v-for="res in reservations" :key="res.id" class="reservation-card">
        <div class="res-header">
           <h4>Reservation #{{ res.id }}</h4>
           <span :class="['status-badge', res.statut?.toLowerCase()]">{{ res.statut }}</span>
        </div>
        <div class="res-details">
          <p><strong>Room:</strong> {{ res.room?.type || 'Room ' + res.chambre_id }}</p>
          <p><strong>Dates:</strong> {{ formatDate(res.date_debut) }} - {{ formatDate(res.date_fin) }}</p>
        </div>
        <div class="res-actions" v-if="res.statut === 'EN_ATTENTE'">
          <button @click="cancelReservation(res.id)" class="btn btn-danger btn-sm">Cancel</button>
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

async function cancelReservation(id) {
  if(!confirm('Are you sure you want to cancel this reservation?')) return
  try {
    await api.put(`/reservations/${id}/annuler`)
    fetchReservations()
  } catch (err) {
    alert('Failed to cancel reservation')
  }
}

onMounted(fetchReservations)
</script>

<style scoped>
.reservation-card {
  background: white;
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  margin-bottom: var(--spacing-md);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
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
</style>
