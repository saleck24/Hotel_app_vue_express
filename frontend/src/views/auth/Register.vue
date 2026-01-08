<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
    <div class="w max-w-md p-4 login-card">
      <h1 class="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">Créer un Compte</h1>

      <form @submit.prevent="register" class="space-y-8">
        <input
          v-model="nom"
          type="text"
          placeholder="Nom"
          required
          class="login-input"
        />

        <input
          v-model="email"
          type="email"
          placeholder="Email"
          required
          class="login-input"
        />

        <input
          v-model="password"
          type="password"
          placeholder="Mot de passe"
          required
          class="login-input"
        />

        <input
          v-model="confirmPassword"
          type="password"
          placeholder="Confirmer le mot de passe"
          required
          class="login-input"
        />

        <button
          type="submit"
          class="w-full login-button"
        >
          S'inscrire
        </button>

        <p v-if="errorMessage" class="login-error">{{ errorMessage }}</p>
      </form>

      <div class="mt-4 text-center">
        <router-link class="login-link" to="/">
          Vous avez déjà un compte? Se connecter
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import API from "../../services/api";

const nom = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const errorMessage = ref("");

const router = useRouter();

const register = async () => {
  if (password.value !== confirmPassword.value) {
    errorMessage.value = "Passwords do not match";
    return;
  }

  try {
    await API.post("/auth/register", {
      nom: nom.value,
      email: email.value,
      password: password.value,
    });

    router.push("/");
  } catch (err) {
    errorMessage.value =
      err.response?.data?.message || "Erreur inscription";
  }
};
</script>
