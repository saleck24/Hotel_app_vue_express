<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <RouterLink to="/" class="brand">
        <span class="brand-text">Hotel<span class="brand-accent">App</span></span>
      </RouterLink>
    </div>

    <nav class="sidebar-nav">
      <ul v-if="role === 'admin'">
        <li><RouterLink to="/admin" exact-active-class="active">Dashboard</RouterLink></li>
        <li><RouterLink to="/admin/rooms" active-class="active">Rooms</RouterLink></li>
        <li><RouterLink to="/admin/reservations" active-class="active">Reservations</RouterLink></li>
        <li><RouterLink to="/admin/users" active-class="active">Users</RouterLink></li>
        <li><RouterLink to="/admin/chat" active-class="active">Messages</RouterLink></li>
      </ul>
      <ul v-else>
        <li><RouterLink to="/client" exact-active-class="active">Dashboard</RouterLink></li>
        <li><RouterLink to="/client/reservations" active-class="active">My Reservations</RouterLink></li>
        <li><RouterLink to="/client/profile" active-class="active">Profile</RouterLink></li>
        <li><RouterLink to="/client/chat" active-class="active">Chat</RouterLink></li>
      </ul>
    </nav>

    <div class="sidebar-footer">
      <button @click="handleLogout" class="btn-logout">
        Logout
      </button>
    </div>
  </aside>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

defineProps({
  role: {
    type: String,
    default: 'client'
  }
})

const authStore = useAuthStore()
const router = useRouter()

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.sidebar {
  width: 250px;
  background-color: var(--color-primary);
  color: white;
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: sticky;
  top: 0;
}

.sidebar-header {
  padding: var(--spacing-lg);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.brand {
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: 700;
  font-family: var(--font-heading);
  color: white;
}

.brand-accent {
  color: var(--color-secondary);
}

.sidebar-nav {
  flex: 1;
  padding: var(--spacing-lg) 0;
}

.sidebar-nav ul {
  list-style: none;
}

.sidebar-nav a {
  display: block;
  padding: var(--spacing-md) var(--spacing-lg);
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: all 0.2s;
  border-left: 4px solid transparent;
}

.sidebar-nav a:hover,
.sidebar-nav a.active {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  border-left-color: var(--color-secondary);
}

.sidebar-footer {
  padding: var(--spacing-lg);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.btn-logout {
  width: 100%;
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: var(--spacing-sm);
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: all 0.2s;
}

.btn-logout:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: white;
}
</style>
