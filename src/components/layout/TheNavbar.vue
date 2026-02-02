<template>
  <header class="navbar">
    <div class="container navbar-content">
      <RouterLink to="/" class="brand">
        <span class="brand-text">Hotel<span class="brand-accent">App</span></span>
      </RouterLink>

      <nav class="nav-links">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/rooms">Rooms</RouterLink>
        <RouterLink to="/about">About Us</RouterLink>
      </nav>

      <div class="nav-actions">
        <template v-if="authStore.isAuthenticated">
          <!-- Quick link to dashboard based on role -->
          <RouterLink 
            :to="authStore.isAdmin ? '/admin' : '/client'" 
            class="btn btn-primary"
          >
            Dashboard
          </RouterLink>
          <button @click="handleLogout" class="btn btn-outline" style="margin-left: 0.5rem">Logout</button>
        </template>
        <template v-else>
          <RouterLink to="/login" class="btn btn-outline">Login</RouterLink>
          <RouterLink to="/register" class="btn btn-primary" style="margin-left: 0.5rem">Book Now</RouterLink>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.navbar {
  background-color: white;
  box-shadow: var(--shadow-sm);
  height: 70px;
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 50;
}

.navbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.brand {
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: 700;
  font-family: var(--font-heading);
  color: var(--color-primary);
}

.brand-accent {
  color: var(--color-secondary);
}

.nav-links {
  display: flex;
  gap: var(--spacing-lg);
}

.nav-links a {
  text-decoration: none;
  color: var(--color-text);
  font-weight: 500;
  transition: color 0.2s;
}

.nav-links a:hover, 
.nav-links a.router-link-active {
  color: var(--color-secondary);
}

.nav-actions {
  display: flex;
  align-items: center;
}

/* Mobile responsive adjustments can be added here with media queries */
@media (max-width: 768px) {
  .nav-links {
    display: none; /* For simplicity, normally hamburger menu */
  }
}
</style>
