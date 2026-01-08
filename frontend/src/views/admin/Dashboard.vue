<template>
  <div>
    <h1 class="text-2xl font-bold gap-4 mb-6">Dashboard Administrateur</h1>

    <!-- Cards -->
    <div class="grid grid-cols-4 gap-4 mb-8">
      <StatCard title="Taux d'occupations" :value="stats.occupancyRate + '%'" />
      <StatCard title="Revenue Totaux" :value="stats.totalRevenue + ' MR'" />
      <StatCard title="Avis clients" :value="stats.reviewsCount" />
    </div>

    <!-- Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 class="font-semibold mb-4 text-gray-900 dark:text-gray-100">Dernières réservations</h2>

      <table class="w-full border-collapse border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
        <thead class="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th class="p-3 border border-gray-300 dark:border-gray-600 text-left">Client</th>
            <th class="p-3 border border-gray-300 dark:border-gray-600 text-left">Chambre</th>
            <th class="p-3 border border-gray-300 dark:border-gray-600 text-left">Statut</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in reservations" :key="r.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
            <td class="p-3 border border-gray-300 dark:border-gray-600">{{ r.client }}</td>
            <td class="p-3 border border-gray-300 dark:border-gray-600">{{ r.room }}</td>
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
  occupancyRate: 0,
  totalRevenue: 0,
  reviewsCount: 0,
  payments: 0,
});

const reservations = ref([]);

onMounted(async () => {
  try {
    // Taux d'occupations
    const occupancyRes = await API.get("/stats/occupancy-rate");
    stats.value.occupancyRate = occupancyRes.data.rate;

    // Revenue Totaux
    const revenueRes = await API.get("/stats/total-revenue");
    stats.value.totalRevenue = revenueRes.data.total;

    // Avis clients
    const reviewsRes = await API.get("/stats/reviews-count");
    stats.value.reviewsCount = reviewsRes.data.count;

    // Paiements (si nécessaire, sinon garder hardcodé)
    stats.value.payments = 5;
  } catch (err) {
    console.error("Erreur lors du chargement des stats:", err);
    // Valeurs par défaut en cas d'erreur
    stats.value = {
      occupancyRate: 0,
      totalRevenue: 0,
      reviewsCount: 0,
      payments: 0,
    };
  }

  // Dernières réservations (hardcodé pour l'instant)
  reservations.value = [
    { id: 1, client: "Ali", room: "101", status: "Confirmée" },
    { id: 2, client: "Sara", room: "202", status: "En attente" },
  ];
});
</script>
