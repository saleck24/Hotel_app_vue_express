<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
    <div class="w max-w-md p-4 login-card">
      <h1 class="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">Réinitialiser le mot de passe</h1>

      <form @submit.prevent="resetPassword" class="space-y-8">
        <input
          v-model="newPassword"
          type="password"
          placeholder="Nouveau mot de passe"
          required
          class="login-input"
        />

        <button
          type="submit"
          class="w-full login-button"
        >
          Réinitialiser
        </button>

        <p v-if="errorMessage" class="login-error">{{ errorMessage }}</p>
      </form>

      <div class="mt-4 text-center">
        <router-link class="login-link" to="/">
          Retour à la connexion
        </router-link>
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
