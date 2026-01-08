<template>
  <div>
    <h1 class="text-2xl font-bold gap-4 mb-6">Dashboard Client</h1>

    <!-- Cards -->
    <div class="grid grid-cols-4 gap-4 mb-8">
      <StatCard title="Mes réservations" :value="stats.myReservations" />
      <StatCard title="Réservations confirmées" :value="stats.confirmedReservations" />
      <StatCard title="Réservations en attente" :value="stats.pendingReservations" />
    </div>

    <!-- Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 class="font-semibold mb-4 text-gray-900 dark:text-gray-100">Mes dernières réservations</h2>

      <table class="w-full border-collapse border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
        <thead class="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th class="p-3 border border-gray-300 dark:border-gray-600 text-left">Chambre</th>
            <th class="p-3 border border-gray-300 dark:border-gray-600 text-left">Date d'arrivée</th>
            <th class="p-3 border border-gray-300 dark:border-gray-600 text-left">Date de départ</th>
            <th class="p-3 border border-gray-300 dark:border-gray-600 text-left">Statut</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in reservations" :key="r.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
            <td class="p-3 border border-gray-300 dark:border-gray-600">{{ r.room }}</td>
            <td class="p-3 border border-gray-300 dark:border-gray-600">{{ r.checkIn }}</td>
            <td class="p-3 border border-gray-300 dark:border-gray-600">{{ r.checkOut }}</td>
            <td class="p-3 border border-gray-300 dark:border-gray-600">{{ r.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import StatCard from "../../components/StatCard.vue";
import API from "../../services/api";

const stats = ref({
  myReservations: 0,
  confirmedReservations: 0,
  pendingReservations: 0,
});

const reservations = ref([]);

onMounted(async () => {
  try {
    // Charger les réservations de l'utilisateur
    const res = await API.get("/reservations/my");
    reservations.value = res.data;

    // Calculer les stats
    stats.value.myReservations = reservations.value.length;
    stats.value.confirmedReservations = reservations.value.filter(r => r.status === 'Confirmée').length;
    stats.value.pendingReservations = reservations.value.filter(r => r.status === 'En attente').length;
  } catch (err) {
    console.error("Erreur lors du chargement des réservations:", err);
    // Valeurs par défaut
    reservations.value = [
      { id: 1, room: "101", checkIn: "2024-01-10", checkOut: "2024-01-12", status: "Confirmée" },
      { id: 2, room: "202", checkIn: "2024-01-15", checkOut: "2024-01-17", status: "En attente" },
    ];
    stats.value.myReservations = reservations.value.length;
    stats.value.confirmedReservations = reservations.value.filter(r => r.status === 'Confirmée').length;
    stats.value.pendingReservations = reservations.value.filter(r => r.status === 'En attente').length;
  }
});
</script>