<template>
  <header class="navbar">
    <div class="container navbar-content">
      <RouterLink to="/" class="brand" style="margin-left: 2rem">
        <span class="brand-text">Hotel<span class="brand-accent">App</span></span>
      </RouterLink>

      <div class="nav-actions">
        <RouterLink to="/login" class="nav-login-link">Connexion</RouterLink>
        <RouterLink to="/register" class="btn btn-primary" style="margin-left: 1.5rem">Réserver</RouterLink>
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

.nav-login-link {
  color: #1a2a44;
  font-weight: 700;
  text-decoration: none;
  transition: color 0.3s;
  font-size: 1.0625rem;
}

.nav-login-link:hover {
  color: #c5a059;
}

/* Mobile responsive adjustments can be added here with media queries */
@media (max-width: 768px) {
  .nav-links {
    display: none; /* For simplicity, normally hamburger menu */
  }
}
</style>
