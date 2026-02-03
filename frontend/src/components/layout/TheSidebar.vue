<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <RouterLink to="/" class="brand">
        <span class="brand-text">Hotel<span class="brand-accent">App</span></span>
      </RouterLink>
    </div>

    <nav class="sidebar-nav">
      <ul v-if="role === 'admin'">
        <li><RouterLink to="/admin" exact-active-class="active">Tableau de Bord</RouterLink></li>
        <li><RouterLink to="/admin/rooms" active-class="active">Chambres</RouterLink></li>
        <li><RouterLink to="/admin/reservations" active-class="active">Réservations</RouterLink></li>
        <li><RouterLink to="/admin/users" active-class="active">Utilisateurs</RouterLink></li>
        <li><RouterLink to="/admin/profile" active-class="active">Profil</RouterLink></li>
        <li><RouterLink to="/admin/reviews" active-class="active">Avis</RouterLink></li>
        <li><RouterLink to="/admin/chat" active-class="active">Messages</RouterLink></li>
      </ul>
      <ul v-else>
        <li><RouterLink to="/client" exact-active-class="active">Tableau de Bord</RouterLink></li>
        <li><RouterLink to="/client/reservations" active-class="active">Mes Réservations</RouterLink></li>
        <li><RouterLink to="/client/profile" active-class="active">Profil</RouterLink></li>
        <li><RouterLink to="/client/chat" active-class="active">Chat</RouterLink></li>
      </ul>
    </nav>

    <div class="sidebar-footer">
      <button @click="handleLogout" class="sidebar-logout-btn">
        Déconnexion
      </button>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { userState, loadUser } from '@/stores/user'
import { useRouter } from 'vue-router'

defineProps({
  role: {
    type: String,
    default: 'client'
  }
})

const authStore = useAuthStore()
const router = useRouter()

// Load user data if not present (logic from Version A)
loadUser()

const userName = computed(() => authStore.user?.nom || userState.nom || 'Utilisateur')
const userProfileImage = computed(() => userState.profile_image || '/default-avatar.jpg')

function handleLogout() {
  authStore.logout()
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  router.push('/login')
}
</script>

<style scoped>
.sidebar {
  width: 260px;
  background-color: #1a2a44;
  color: white;
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: sticky;
  top: 0;
  z-index: 100;
}

.sidebar-header {
  padding: 2.5rem 1.5rem;
}

.brand {
  text-decoration: none;
  font-size: 1.75rem;
  font-weight: 800;
  font-family: var(--font-heading);
  color: white;
  letter-spacing: -0.02em;
}

.brand-accent {
  color: #c5a059;
}

.sidebar-nav {
  flex: 1;
  padding: 0;
}

.sidebar-nav ul {
  list-style: none;
  padding: 0;
}

.sidebar-nav a {
  display: block;
  padding: 1rem 1.5rem;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: all 0.3s ease;
  font-weight: 500;
  font-size: 1.0625rem;
}

.sidebar-nav a:hover,
.sidebar-nav a.active {
  background-color: rgba(255, 255, 255, 0.08);
  color: white;
}

.sidebar-footer {
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-logout-btn {
  width: 100%;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.75rem;
  cursor: pointer;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.sidebar-logout-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: white;
}
</style>
