<template>
<<<<<<< Updated upstream
  <div class="flex min-h-screen">
    <!-- Sidebar -->
    <aside class="w-64 bg-white text-gray-900 dark:bg-gray-800 dark:text-violetDark shadow-md border-r border-gray-300 dark:border-gray-600">
      
      <!-- Profil -->
      <div class="p-4 text-center border-b dark:border-gray-700">
        <img
          :src="userState.profile_image"
          class="profile-image mx-auto rounded-full object-cover border dark:border-gray-600"
          alt="Photo de profil"
        />

        <p class="mt-2 font-semibold dark:text-violetDark">{{ userState.nom }}</p>

        <!-- Upload image -->
        <input
          v-if="showProfileEdit"
          type="file"
          accept="image/*"
          class="mt-2 text-sm w-full dark:text-violetDark"
          @change="updateProfileImage"
        />
      </div>

      <!-- Menu -->
      <nav class="p-4 space-y-2">
        <RouterLink to="/client/dashboard" class="menu-link text-gray-700 dark:text-violetDark">
          <HomeIcon class="menu-icon" />
          <span>Accueil</span>
        </RouterLink>

        <RouterLink to="/client/reservations" class="menu-link text-gray-700 dark:text-violetDark">
          Mes réservations
        </RouterLink>

        <!-- Paramètres -->
        <button @click="toggleSettings"class="menu-link flex items-center gap-2 text-gray-700 dark:text-violetDark hover:bg-gray-700">
            <Cog6ToothIcon class="menu-icon" />
            <span>Paramètres</span>
        </button>

        <!-- Accordion -->
        <div v-show="showSettings" class="ml-6 space-y-2">
          <RouterLink to="/client/profile" class="submenu-link text-gray-700 dark:text-violetDark">
            <UserIcon class="submenu-icon" />
            Modifier profil
          </RouterLink>
          <div class="submenu-link">
            <DarkMode />
          </div>
        </div>

        <!-- Déconnexion -->
        <button @click="logout"class="menu-link flex items-center gap-2 logout-link">
            <PowerIcon class="menu-icon logout-icon" />
            <span>Déconnexion</span>
        </button>
      </nav>
    </aside>

    <!-- Main -->
    <main class="flex-1 p-6">
      <RouterView />
=======
  <div class="layout-dashboard">
    <TheSidebar role="client" />
    <main class="dashboard-content">
      <header class="dashboard-header">
        <h2 class="page-title">{{ $route.name || 'Dashboard' }}</h2>
        <div class="user-info">
          <span>{{ authStore.user?.nom || 'Client' }}</span>
        </div>
      </header>
      <div class="content-wrapper">
        <slot />
      </div>
>>>>>>> Stashed changes
    </main>
  </div>
</template>

<script setup>
<<<<<<< Updated upstream
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import API from "../services/api"; 
import { userState, updateUser,loadUser } from "../stores/user";
import DarkMode from "../components/DarkMode.vue";


// Icônes Heroicons (officiel Tailwind)
import { Cog6ToothIcon, PowerIcon, HomeIcon, UserIcon } from "@heroicons/vue/24/outline";

const router = useRouter();

const showSettings = ref(false);
const showProfileEdit = ref(false);
const darkMode = ref(false);

// Charger thème depuis localStorage
onMounted(() => {
  loadUser(); // initialise userState depuis localStorage
});

// ===== METHODS =====

const toggleSettings = () => {
  showSettings.value = !showSettings.value;
};

const updateProfileImage = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Affichage immédiat de l'image sélectionnée
  userState.profile_image = URL.createObjectURL(file);

  const formData = new FormData();
  formData.append("profile_image", file);

  const token = localStorage.getItem("token");

  try {
    const res = await API.put("/users/profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    // Mettre à jour le store avec la vraie URL renvoyée par le backend
    updateUser(res.data.user);
  } catch (err) {
    console.error(err);
    alert("Erreur lors de la mise à jour de l'image");
  }
};


const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  router.push("/");
};
</script>

<style>
.menu-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 10px;
  border-radius: 6px;
  width: 100%;
  text-align: left;
  transition: background-color 0.3s ease, color 0.3s ease, transform 0.2s ease;
  cursor: pointer;
}

.menu-link:hover {
  background-color: #f3f4f6; /* gray-100 */
  transform: translateX(4px);
}

.dark .menu-link:hover {
  background-color: #374151; /* gray-700 */
  transform: translateX(4px);
}
</style>
=======
import TheSidebar from '@/components/layout/TheSidebar.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<style scoped>
/* Reusing dashboard styles - could be extracted */
.layout-dashboard {
  display: flex;
  min-height: 100vh;
  background-color: var(--color-background);
}

.dashboard-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.dashboard-header {
  background-color: white;
  padding: var(--spacing-md) var(--spacing-xl);
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: var(--shadow-sm);
}

.page-title {
  text-transform: capitalize;
  font-size: 1.25rem;
}

.content-wrapper {
  padding: var(--spacing-xl);
  flex: 1;
  overflow-y: auto;
}
</style>
>>>>>>> Stashed changes
