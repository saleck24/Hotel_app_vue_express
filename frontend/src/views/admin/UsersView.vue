<template>
  <div class="users-view">
    <div class="header">
      <h2 class="title">Liste des Utilisateurs</h2>
    </div>
    
    <div v-if="loading" class="loading">Chargement...</div>
    <div v-else class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Email</th>
            <th>Rôle</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>#{{ user.id }}</td>
            <td>{{ user.nom }}</td>
            <td>{{ user.email }}</td>
            <td><span :class="['role-badge', user.role?.toLowerCase()]">{{ user.role || 'Client' }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const users = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await api.get('/users')
    users.value = res.data
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.users-view {
  padding: 1rem 0;
}

.header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.title {
  font-family: var(--font-heading);
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--color-primary);
  letter-spacing: -0.02em;
}

:global(.dark) .title {
  color: var(--color-text);
}

.table-container {
  background: white;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  overflow-x: auto;
  border: 1px solid #ddd;
}

:global(.dark) .table-container {
  background: var(--color-surface);
  border-color: rgba(255,255,255,0.1);
}

.data-table { 
  width: 100%; 
  border-collapse: collapse; 
  text-align: left; 
}

.data-table th, .data-table td { 
  padding: var(--spacing-md); 
  border: 1px solid #ddd; 
  color: var(--color-text);
}

:global(.dark) .data-table th, 
:global(.dark) .data-table td {
  border-color: rgba(255,255,255,0.1);
}

.data-table th {
  background-color: #f1f1f1;
  font-weight: 700;
  color: var(--color-primary);
  text-transform: uppercase;
  font-size: 0.85rem;
}

:global(.dark) .data-table th {
  background-color: rgba(0,0,0,0.2);
  color: var(--color-text);
}

.role-badge {
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  background: #eee;
  color: #666;
}

:global(.dark) .role-badge {
  background: #374151;
  color: #d1d5db;
}

.role-badge.admin {
  background-color: var(--color-primary);
  color: white;
}

:global(.dark) .role-badge.admin {
  background-color: var(--color-secondary);
  color: white;
}

.loading {
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  color: var(--color-text-muted);
}
</style>
