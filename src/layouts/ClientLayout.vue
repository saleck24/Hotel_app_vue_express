<template>
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
    </main>
  </div>
</template>

<script setup>
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
