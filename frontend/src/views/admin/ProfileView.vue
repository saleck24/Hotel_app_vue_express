<template>
  <div class="profile-view">
    <div class="profile-card">
      <h3>Modifier le profil</h3>
      <form @submit.prevent="updateProfile">
        <BaseInput label="Nom" id="name" v-model="form.nom" required />
        <BaseInput label="Email" id="email" v-model="form.email" type="email" required />
        <BaseInput label="Nouveau mot de passe" id="password" v-model="form.password" type="password" />
        <BaseButton type="submit" :loading="loading">Mettre à jour le profil</BaseButton>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const authStore = useAuthStore()
const form = ref({
  nom: '',
  email: '',
  password: ''
})
const loading = ref(false)

onMounted(() => {
  if (authStore.user) {
    form.value.nom = authStore.user.nom
    form.value.email = authStore.user.email
  }
})

async function updateProfile() {
  loading.value = true
  try {
    const res = await api.put('/users/profile', form.value)
    // Mettre à jour le store
    if (res.data.user) {
      authStore.updateUser(res.data.user)
    }
    alert('Profil mis à jour avec succès')
    form.value.password = '' // Vider le champ mot de passe après succès
  } catch (err) {
    alert('Échec de la mise à jour du profil')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.profile-card {
  background: var(--color-surface);
  padding: var(--spacing-xl);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  max-width: 600px;
  border: 1px solid rgba(0,0,0,0.05);
}

:global(.dark) .profile-card {
  border: 1px solid rgba(255,255,255,0.1);
}

h3 {
  margin-bottom: var(--spacing-lg);
  color: var(--color-primary);
  font-weight: 700;
}

:global(.dark) h3 {
  color: var(--color-text);
}
</style>
