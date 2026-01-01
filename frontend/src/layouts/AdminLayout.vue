<template>
  <div class="flex h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Sidebar -->
    <aside class="z-20 hidden w-64 overflow-y-auto bg-white dark:bg-gray-800 md:block">
      <div class="py-4 text-gray-500 dark:text-gray-400">
        <router-link
          class="ml-6 text-lg font-bold text-gray-800 dark:text-gray-200"
          to="/admin/dashboard"
        >
          Hotel Admin
        </router-link>

        <ul class="mt-6">
          <li class="relative px-6 py-3">
            <router-link
              class="inline-flex items-center w-full text-sm font-semibold"
              to="/admin/dashboard"
            >
              Dashboard
            </router-link>
          </li>

          <li class="relative px-6 py-3">
            <router-link to="/admin/users">Utilisateurs</router-link>
          </li>

          <li class="relative px-6 py-3">
            <router-link to="/admin/chambres">Chambres</router-link>
          </li>
        </ul>
      </div>
    </aside>

    <!-- Main -->
    <div class="flex flex-col flex-1 w-full">
      <header class="z-10 py-4 bg-white shadow-md dark:bg-gray-800">
        <div class="container flex items-center justify-between h-full px-6 mx-auto">
          <span class="text-gray-800 dark:text-gray-200">Admin</span>

          <button @click="logout" class="text-sm text-red-500">
            Déconnexion
          </button>
        </div>
      </header>

      <main class="h-full overflow-y-auto">
        <div class="container px-6 mx-auto grid">
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const logout = () => {
  localStorage.removeItem("token");
  router.push("/");
};
</script>
