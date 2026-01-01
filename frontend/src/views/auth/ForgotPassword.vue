<template>
  <div class="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
    <div
      class="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800"
    >
      <div class="flex flex-col overflow-y-auto md:flex-row">

        <!-- Image à gauche -->
        <div class="h-32 md:h-auto md:w-1/2">
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
        <div class="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
          <div class="w-full">

            <h1 class="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
              Mot de passe oublié
            </h1>

            <form @submit.prevent="forgotPassword">
              <label class="block text-sm">
                <span class="text-gray-700 dark:text-gray-400">E-mail</span>
                <input
                  v-model="email"
                  type="email"
                  required
                  placeholder="exemple@gmail.com"
                  class="block w-full mt-1 text-base
                         py-2 px-3
                         border border-gray-300
                         dark:border-gray-600
                         dark:bg-gray-700
                         focus:border-purple-400
                         focus:outline-none
                         focus:ring-1
                         focus:ring-purple-400
                         dark:text-gray-300
                         rounded-md"
                />
              </label>

              <button
                type="submit"
                class="block w-full px-4 py-2 mt-4 text-sm font-medium leading-5
                       text-center text-white
                       bg-purple-600
                       rounded-lg
                       hover:bg-purple-700
                       focus:outline-none
                       focus:ring
                       focus:ring-purple-300
                       transition-colors"
              >
                Récupérer le mot de passe
              </button>
            </form>

            <p class="mt-4 text-sm text-center">
              <router-link
                to="/"
                class="font-medium text-purple-600 dark:text-purple-400 hover:underline"
              >
                Retour à la connexion
              </router-link>
            </p>

          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import API from "../../services/api";

const office = new URL('../../assets/img/forgot-password-office.jpeg', import.meta.url).href
const officeDark = new URL('../../assets/img/forgot-password-office-dark.jpeg', import.meta.url).href

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
