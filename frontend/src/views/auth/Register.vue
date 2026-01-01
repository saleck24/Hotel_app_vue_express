<template>
  <div class="flex items-center justify-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
    <div class="flex w-full max-w-4xl overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">

      <!-- Image à gauche -->
      <div class="hidden md:block md:w-1/2">
        <img
          class="object-cover w-full h-full dark:hidden"
          :src="office"
          alt="Office"
        />
        <img
          class="hidden object-cover w-full h-full dark:block"
          :src="officeDark"
          alt="Office Dark"
        />
      </div>

      <!-- Formulaire à droite -->
      <div class="flex items-center justify-center w-full md:w-1/2 p-6 sm:p-12">
        <div class="w-full">
          <h1 class="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
            Créer un Compte
          </h1>

          <form @submit.prevent="register" class="space-y-4">
            <!-- Nom -->
            <label class="block text-sm">
              <span class="text-gray-700 dark:text-gray-400">Nom</span>
              <input
                v-model="nom"
                type="text"
                required
                placeholder="Votre nom"
                class="block w-full mt-1 text-sm form-input border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:ring-2 focus:ring-purple-300 dark:text-gray-300"
              />
            </label>

            <!-- Email -->
            <label class="block text-sm">
              <span class="text-gray-700 dark:text-gray-400">E-mail</span>
              <input
                v-model="email"
                type="email"
                required
                placeholder="exemple@gmail.com"
                class="block w-full mt-1 text-sm form-input border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:ring-2 focus:ring-purple-300 dark:text-gray-300"
              />
            </label>

            <!-- Password -->
            <label class="block text-sm">
              <span class="text-gray-700 dark:text-gray-400">Mot de passe</span>
              <input
                v-model="password"
                type="password"
                required
                placeholder="********"
                class="block w-full mt-1 text-sm form-input border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:ring-2 focus:ring-purple-300 dark:text-gray-300"
              />
            </label>

            <!-- Confirm password -->
            <label class="block text-sm">
              <span class="text-gray-700 dark:text-gray-400">
                Confirmer le mot de passe
              </span>
              <input
                v-model="confirmPassword"
                type="password"
                required
                placeholder="********"
                class="block w-full mt-1 text-sm form-input border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:ring-2 focus:ring-purple-300 dark:text-gray-300"
              />
            </label>

            <!-- Checkbox
            <div class="flex items-center text-sm">
              <input
                type="checkbox"
                required
                class="text-purple-600 form-checkbox focus:border-purple-400 focus:ring-purple-300"
              />
              <span class="ml-2 text-gray-700 dark:text-gray-400">
                I agree to the <span class="underline">privacy policy</span>
              </span>
            </div> -->

            <!-- Bouton Register -->
            <button
              type="submit"
              class="block w-full px-4 py-2 mt-4 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-300"
            >
              S'inscrire
            </button>

            <p v-if="errorMessage" class="text-sm text-red-500">
              {{ errorMessage }}
            </p>
          </form>

          <hr class="my-8" />
          <!-- Lien login -->
          <p class="mt-4 text-sm text-center">
            <router-link
              to="/"
              class="font-medium text-purple-600 dark:text-purple-400 hover:underline"
            >
              Vous avez déjà? Se connecter
            </router-link>
          </p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import API from "../../services/api";

const office = new URL("../../assets/img/create-account-office.jpeg", import.meta.url).href;
const officeDark = new URL("../../assets/img/create-account-office-dark.jpeg", import.meta.url).href;

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
