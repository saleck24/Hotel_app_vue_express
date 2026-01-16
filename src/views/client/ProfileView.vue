<template>
  <div class="profile-view">
    <div class="profile-card">
      <h3>Edit Profile</h3>
      <form @submit.prevent="updateProfile">
        <BaseInput label="Name" id="name" v-model="form.nom" required />
        <BaseInput label="Email" id="email" v-model="form.email" type="email" required />
        <!-- Password update could be added here -->
        
        <BaseButton type="submit" :loading="loading">Update Profile</BaseButton>
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
  email: ''
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
    // Update store
    // authStore.user = res.data // assuming API returns updated user
    alert('Profile updated successfully')
  } catch (err) {
    alert('Failed to update profile')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.profile-card {
  background: white;
  padding: var(--spacing-xl);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  max-width: 600px;
}
</style>
