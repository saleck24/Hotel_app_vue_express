<template>
  <div class="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
    <div class="flex-1 max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
      <div class="flex flex-col md:flex-row">

        <!-- Image à gauche -->
        <div class="h-32 md:h-auto md:w-1/2">
          <img
            class="object-cover w-full h-full dark:hidden"
            :src="office"
            alt="Reset Password"
          />
          <img
            class="hidden object-cover w-full h-full dark:block"
            :src="officeDark"
            alt="Reset Password Dark"
          />
        </div>

        <!-- Formulaire à droite -->
        <div class="flex items-center justify-center w-full md:w-1/2 p-6 sm:p-12">
          <div class="w-full">
            <h1 class="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200 text-center md:text-left">
              Réinitialiser le mot de passe
            </h1>

            <form @submit.prevent="resetPassword" class="space-y-4">
              <!-- Nouveau mot de passe -->
              <label class="block text-sm">
                <span class="text-gray-700 dark:text-gray-400">Nouveau mot de passe</span>
                <input
                  v-model="newPassword"
                  type="password"
                  required
                  placeholder="********"
                  class="block w-full mt-1 text-sm form-input border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:ring-2 focus:ring-purple-300 dark:text-gray-300 rounded-md"
                />
              </label>

              <!-- Bouton réinitialiser -->
              <button
                type="submit"
                class="block w-full px-4 py-2 mt-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring focus:ring-purple-300 transition-colors"
              >
                Réinitialiser
              </button>

              <!-- Message d'erreur -->
              <p v-if="errorMessage" class="text-sm text-red-500 mt-2">{{ errorMessage }}</p>
            </form>

            <p class="mt-4 text-sm text-center">
              Retour à la 
              <router-link to="/" class="font-medium text-purple-600 dark:text-purple-400 hover:underline">
                connexion
              </router-link>
            </p>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import API from "../../services/api";

const newPassword = ref("");
const errorMessage = ref("");
const router = useRouter();
const route = useRoute();

// Récupération du token depuis l'URL
let token = "";
onMounted(() => {
  token = route.query.token || "";
  if (!token) {
    errorMessage.value = "Lien de réinitialisation invalide.";
  }
});

// Images
const office = new URL('../../assets/img/forgot-password-office.jpeg', import.meta.url).href;
const officeDark = new URL('../../assets/img/forgot-password-office-dark.jpeg', import.meta.url).href;

const resetPassword = async () => {
  if (!token) return; // ne rien faire si le token est vide

  try {
    await API.post("/auth/reset-password", { token, newPassword: newPassword.value });
    alert("Mot de passe réinitialisé avec succès !");
    router.push("/");
  } catch (err) {
    errorMessage.value = err.response?.data?.message || "Erreur lors de la réinitialisation";
  }
};
</script>
