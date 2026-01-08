<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
    <div class="w max-w-md p-4 login-card">
      <h1 class="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">Mot de passe oublié</h1>

      <form @submit.prevent="forgotPassword" class="space-y-8">
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          required
          class="login-input"
        />

        <button
          type="submit"
          class="w-full login-button"
        >
          Récupérer le mot de passe
        </button>
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
import { ref } from "vue"
import API from "../../services/api";

const email = ref("")

const forgotPassword = async () => {
  try {
    await API.post("/auth/forgot-password", { email: email.value });
    alert("Lien de réinitialisation envoyé à votre email !");
    email.value = ""; // reset champ
  } catch (err) {
    alert(err.response?.data?.message || "Erreur lors de la demande");
  }
};
</script>
