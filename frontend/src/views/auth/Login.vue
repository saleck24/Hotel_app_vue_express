<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
    <div class="flex flex-col md:flex-row bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl overflow-hidden">

      <!-- Image à gauche -->
      <div class="md:w-1/2 h-48 md:h-auto">
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
      <div class="md:w-1/2 flex items-center justify-center p-6 sm:p-8">
        <div class="w-full">
          <h1 class="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200 text-center md:text-left">Login</h1>

          <form @submit.prevent="login" class="space-y-3">

            <div>
              <label class="block text-sm text-gray-700 dark:text-gray-400 mb-1">E-mail</label>
              <input
                v-model="email"
                type="email"
                placeholder="Email"
                required
                class="block w-full px-3 py-2 text-sm rounded-md border-2 border-gray-400 dark:border-gray-500 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-500 dark:text-gray-300"
              />
            </div>

            <div>
              <label class="block text-sm text-gray-700 dark:text-gray-400 mb-1">Mot de passe</label>
              <input
                v-model="password"
                type="password"
                placeholder="********"
                required
                class="block w-full px-3 py-2 text-sm rounded-md border-2 border-gray-400 dark:border-gray-500 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-500 dark:text-gray-300"
              />
            </div>

            <button
              type="submit"
              class="w-full py-2 px-4 mt-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring focus:ring-purple-200 transition-colors"
            >
              Se connecter
            </button>

            <p class="mt-1 text-red-500 text-sm" v-if="errorMessage">{{ errorMessage }}</p>
          </form>

          <hr class="my-4 border-gray-200 dark:border-gray-700" />

          <p class="text-sm text-center mt-2">
            <router-link class="text-purple-600 dark:text-purple-400 hover:underline font-bold" to="/forgot-password">
              Mot de passe oublié?
            </router-link>
          </p>
          <p class="text-sm text-center mt-1">
            <router-link class="text-purple-600 dark:text-purple-400 hover:underline font-bold" to="/register">
              S'inscrire
            </router-link>
          </p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import API from "../../services/api";
import { useRouter } from "vue-router";

const office = new URL('../../assets/img/login-office.jpeg', import.meta.url).href;
const officeDark = new URL('../../assets/img/login-office-dark.jpeg', import.meta.url).href;

const email = ref("");
const password = ref("");
const errorMessage = ref("");
const router = useRouter();

const login = async () => {
  try {
    const res = await API.post("/auth/login", {
      email: email.value,
      password: password.value,
    });

    localStorage.setItem("token", res.data.token);

    // redirection vers le dashboard admin
    router.push("/admin/dashboard");

  } catch (err) {
    errorMessage.value =
      err.response?.data?.message || "Erreur login";
  }
};
</script>
