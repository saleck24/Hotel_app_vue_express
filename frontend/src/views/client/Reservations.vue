<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6 text-gray-800 dark:text-white text-center">Mes réservations</h1>

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div v-if="loading" class="text-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        <p class="mt-2 text-gray-600 dark:text-gray-400">Chargement des réservations...</p>
      </div>

      <div v-else-if="reservations.length === 0" class="text-center py-8">
        <p class="text-gray-600 dark:text-gray-400">Vous n'avez aucune réservation.</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="reservation in reservations" :key="reservation.id" class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <div class="flex flex-col space-y-4">
            <div>
              <strong>Chambre :</strong> {{ reservation.room }}
            </div>
            <div>
              <strong>Date d'arrivée :</strong> {{ reservation.checkIn }}
            </div>
            <div>
              <strong>Date de départ :</strong> {{ reservation.checkOut }}
            </div>
            <div>
              <strong>Statut :</strong>
              <span :class="getStatusClass(reservation.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                {{ reservation.status }}
              </span>
            </div>
            <div>
              <strong>Prix total :</strong> {{ reservation.totalPrice }} €
            </div>
          </div>
          <div v-if="reservation.status === 'En attente'" class="mt-6 flex justify-end">
            <button @click="cancelReservation(reservation.id)" class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import API from "../../services/api";

const reservations = ref([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const res = await API.get("/reservations/my");
    reservations.value = res.data;
  } catch (err) {
    console.error("Erreur lors du chargement des réservations:", err);
    // Données de test
    reservations.value = [
      { id: 1, room: "101", checkIn: "2024-01-10", checkOut: "2024-01-12", status: "Confirmée", totalPrice: 200 },
      { id: 2, room: "202", checkIn: "2024-01-15", checkOut: "2024-01-17", status: "En attente", totalPrice: 300 },
    ];
  } finally {
    loading.value = false;
  }
});

const getStatusClass = (status) => {
  switch (status) {
    case 'Confirmée':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'En attente':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 'Annulée':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  }
};

const cancelReservation = async (id) => {
  if (confirm("Êtes-vous sûr de vouloir annuler cette réservation ?")) {
    try {
      await API.delete(`/reservations/${id}`);
      // Recharger les réservations
      const res = await API.get("/reservations/my");
      reservations.value = res.data;
    } catch (err) {
      console.error("Erreur lors de l'annulation:", err);
      alert("Erreur lors de l'annulation de la réservation");
    }
  }
};
</script>