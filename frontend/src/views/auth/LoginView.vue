<template>
  <div class="auth-wrapper">
    <div class="auth-card">
      <div class="auth-header">
        <h1 class="text-heading">Welcome Back</h1>
        <p>Sign in to your account related to Hotel App</p>
      </div>

      <form @submit.prevent="handleLogin">
        <BaseInput
          id="email"
          label="Email Address"
          type="email"
          v-model="form.email"
          required
          placeholder="you@example.com"
        />
        
        <BaseInput
          id="password"
          label="Password"
          type="password"
          v-model="form.password"
          required
          placeholder="••••••••"
        />

        <div class="form-actions">
          <RouterLink to="/forgot-password" class="forgot-link">Forgot password?</RouterLink>
        </div>

        <BaseButton type="submit" class="w-full" :loading="loading">
          Sign In
        </BaseButton>
      </form>

      <div class="auth-footer">
        <p>Don't have an account? <RouterLink to="/register">Create one</RouterLink></p>
      </div>
      
      <p v-if="error" class="error-message">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  email: '',
  password: ''
})

const loading = ref(false)
const error = ref('')

async function handleLogin() {
  loading.value = true
  error.value = ''
  
  try {
    await authStore.login(form)
    // Redirect based on role? For now home or dashboard
    if (authStore.isAdmin) {
      router.push('/admin')
    } else {
      router.push('/client') // or home
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Login failed. Please check your credentials.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
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

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: var(--spacing-lg);
}

.forgot-link {
  color: var(--color-primary);
  font-size: 0.875rem;
  text-decoration: none;
}

.forgot-link:hover {
  text-decoration: underline;
}

.auth-footer {
  margin-top: var(--spacing-lg);
  text-align: center;
  font-size: 0.9rem;
}

.auth-footer a {
  color: var(--color-primary);
  font-weight: 600;
  text-decoration: none;
}

.w-full {
  width: 100%;
}

.error-message {
  color: var(--color-danger);
  text-align: center;
  margin-top: var(--spacing-md);
  font-size: 0.875rem;
}
</style>
