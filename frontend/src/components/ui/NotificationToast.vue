<template>
  <div class="notification-container">
    <transition-group name="list">
      <div 
        v-for="notif in store.notifications" 
        :key="notif.id" 
        class="notification-toast"
        :class="`type-${notif.type}`"
      >
        <div class="notif-icon">
          <svg v-if="notif.type === 'success'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <svg v-else-if="notif.type === 'info'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        </div>
        <div class="notif-content">
          <h4 v-if="notif.title">{{ notif.title }}</h4>
          <p>{{ notif.message }}</p>
        </div>
        <button @click="store.removeNotification(notif.id)" class="close-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { useNotificationStore } from '@/stores/notifications'
const store = useNotificationStore()
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 90px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 350px;
  pointer-events: none;
}

.notification-toast {
  pointer-events: auto;
  background: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: flex-start;
  gap: 12px;
  border-left: 4px solid var(--color-primary);
  animation: slideIn 0.3s ease-out;
  overflow: hidden;
  position: relative;
}

.type-success { border-left-color: #22c55e; }
.type-info { border-left-color: var(--color-secondary); }
.type-error { border-left-color: #ef4444; }

.notif-icon {
  flex-shrink: 0;
  margin-top: 2px;
}

.type-success .notif-icon { color: #22c55e; }
.type-info .notif-icon { color: var(--color-secondary); }
.type-error .notif-icon { color: #ef4444; }

.notif-content {
  flex: 1;
}

.notif-content h4 {
  margin: 0 0 4px 0;
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--color-primary);
}

.notif-content p {
  margin: 0;
  font-size: 0.85rem;
  color: var(--color-text-muted);
  line-height: 1.4;
}

.close-btn {
  background: none;
  border: none;
  color: #ccc;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #999;
}

/* Animations */
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.list-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

@keyframes slideIn {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
</style>
