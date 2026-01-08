<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6 text-gray-800 dark:text-white text-center">Réservation à valider</h1>

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div v-if="loading" class="text-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        <p class="mt-2 text-gray-600 dark:text-gray-400">Chargement des réservations...</p>
      </div>

      <div v-else-if="reservations.length === 0" class="text-center py-8">
        <p class="text-gray-600 dark:text-gray-400">Aucune réservation en attente de validation.</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="reservation in reservations" :key="reservation.id" class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <div class="flex flex-col space-y-4">
            <div>
              <strong>Type :</strong> {{ reservation.type }}
            </div>
            <div>
              <strong>Images :</strong>
              <div class="flex space-x-4 mt-2">
                <img v-if="reservation.image1" :src="`http://localhost:3000/uploads/rooms/${getImageName(reservation.image1)}`" alt="Chambre 1" class="room-image object-cover rounded">
                <img v-if="reservation.image2" :src="`http://localhost:3000/uploads/rooms/${getImageName(reservation.image2)}`" alt="Chambre 2" class="room-image object-cover rounded">
                <img v-if="reservation.image3" :src="`http://localhost:3000/uploads/rooms/${getImageName(reservation.image3)}`" alt="Chambre 3" class="room-image object-cover rounded">
              </div>
            </div>
            <div>
              <strong>Statut :</strong>
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                EN ATTENTE
              </span>
            </div>
            <div>
              <strong>Numéro :</strong> {{ reservation.numero }}
            </div>
            <div>
              <strong>Prix :</strong> {{ reservation.prix }} €
            </div>
            <div>
              <strong>Description :</strong> {{ reservation.description }}
            </div>
          </div>
          <div class="mt-6 flex justify-end">
            <button @click="approveReservation(reservation.id)" class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              Valider
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../../services/api.js'

export default {
  name: 'AdminReservations',
  data() {
    return {
      reservations: [],
      loading: true
    }
  },
  mounted() {
    this.fetchPendingReservations()
  },
  methods: {
    async fetchPendingReservations() {
      try {
        const response = await api.get('/reservations/en-attente')
        this.reservations = response.data
      } catch (error) {
        console.error('Erreur lors de la récupération des réservations en attente:', error)
      } finally {
        this.loading = false
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('fr-FR')
    },
    getImageName(imagePath) {
      if (!imagePath) return ''
      return imagePath.split('\\').pop() || imagePath.split('/').pop()
    },
    async approveReservation(id) {
      try {
        await api.put(`/reservations/${id}/valider`)
        this.reservations = this.reservations.filter(r => r.id !== id)
      } catch (error) {
        console.error('Erreur lors de l\'approbation:', error)
      }
    }
  }
}
</script>