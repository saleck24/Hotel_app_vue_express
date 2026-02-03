<template>
  <div class="layout-dashboard">
    <TheSidebar role="admin" />
    <main class="dashboard-content">
      <header class="dashboard-header text-navy">
        <h2 class="page-title">{{ $route.name || 'Tableau de Bord Admin' }}</h2>
        <div class="user-info">
          {{ authStore.user?.nom || 'Admin' }}
        </div>
      </header>
      <div class="content-wrapper">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'
import TheSidebar from '../components/layout/TheSidebar.vue'

const authStore = useAuthStore()
</script>

<style scoped>
.layout-dashboard {
  display: flex;
  min-height: 100vh;
  background-color: var(--color-background);
  color: var(--color-text);
  transition: background-color 0.3s ease, color 0.3s ease;
}

.dashboard-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.dashboard-header {
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--color-surface);
  border-bottom: 1px solid rgba(0,0,0,0.05);
  transition: background-color 0.3s ease;
}

.page-title {
  font-weight: 700;
  color: var(--color-primary); /* Or use var(--color-text) if primary is too dark */
  font-size: 1.25rem;
  text-transform: capitalize;
}

.user-info {
  font-weight: 700;
  color: var(--color-text);
}

.content-wrapper {
  padding: 2rem;
  flex: 1;
  overflow-y: auto;
}

/* Specific fix for dark mode borders or text in header */
:global(.dark) .dashboard-header {
  border-bottom: 1px solid rgba(255,255,255,0.1);
}
:global(.dark) .page-title {
  color: var(--color-text);
}
</style>
