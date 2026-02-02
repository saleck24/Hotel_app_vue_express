<template>
  <div class="auth-wrapper">
    <div class="auth-card">
      <div class="auth-header">
        <h1 class="text-heading">Reset Password</h1>
        <p>Create a new strong password</p>
      </div>

      <form @submit.prevent="handleSubmit" v-if="!success">
        <BaseInput
          id="token"
          label="Reset Token"
          type="text"
          v-model="token"
          required
          placeholder="Enter the code from your email"
        />

        <BaseInput
          id="password"
          label="New Password"
          type="password"
          v-model="newPassword"
          required
          placeholder="Min. 8 characters"
        />

        <BaseButton type="submit" class="w-full" :loading="loading">
          Reset Password
        </BaseButton>
      </form>

      <div v-else class="success-message">
        <p>Your password has been reset successfully.</p>
        <RouterLink to="/login" class="btn btn-primary w-full mt-4">Login Now</RouterLink>
      </div>

      <p v-if="error" class="error-message">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/services/api'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const route = useRoute()

const token = ref('')
const newPassword = ref('')
const loading = ref(false)
const error = ref('')
const success = ref(false)

onMounted(() => {
  // If token is in URL query
  if (route.query.token) {
    token.value = route.query.token
  }
})

async function handleSubmit() {
  loading.value = true
  error.value = ''
  
  try {
    await api.post('/auth/reset-password', {
      token: token.value,
      newPassword: newPassword.value
    })
    success.value = true
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to reset password.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Reusing same styles */
.auth-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: var(--color-background);
  padding: var(--spacing-md);
}

.auth-card {
  background: white;
  padding: var(--spacing-2xl);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  width: 100%;
  max-width: 450px;
}

.auth-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.auth-header h1 {
  font-size: 2rem;
  color: var(--color-primary);
  margin-bottom: var(--spacing-xs);
}

.auth-header p {
  color: var(--color-text-muted);
}

.w-full {
  width: 100%;
}

.mt-4 {
  margin-top: var(--spacing-lg);
}

.error-message {
  color: var(--color-danger);
  text-align: center;
  margin-top: var(--spacing-md);
}

.success-message {
  text-align: center;
  color: var(--color-success);
}
</style>
