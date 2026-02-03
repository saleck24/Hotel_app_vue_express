<template>
  <div class="auth-wrapper">
    <div class="auth-card">
      <div class="auth-header">
        <h1 class="text-heading">Mot de passe oublié</h1>
        <p>Entrez votre e-mail pour recevoir un lien de réinitialisation</p>
      </div>

      <form @submit.prevent="handleSubmit" v-if="!success">
        <BaseInput
          id="email"
          label="Adresse e-mail"
          type="email"
          v-model="email"
          required
          placeholder="votre@exemple.com"
        />

        <BaseButton type="submit" class="w-full" :loading="loading">
          Envoyer le lien
        </BaseButton>
        
        <div class="form-actions mt-4">
           <RouterLink to="/login" class="back-link">Retour à la connexion</RouterLink>
        </div>
      </form>

      <div v-else class="success-message">
        <p>Si un compte existe pour <strong>{{ email }}</strong>, vous recevrez des instructions de réinitialisation.</p>
        <RouterLink to="/login" class="btn btn-primary w-full mt-4">Retour à la connexion</RouterLink>
      </div>

      <p v-if="error" class="error-message">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '@/services/api'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const email = ref('')
const loading = ref(false)
const error = ref('')
const success = ref(false)

async function handleSubmit() {
  loading.value = true
  error.value = ''
  
  try {
    await api.post('/auth/forgot-password', { email: email.value })
    success.value = true
  } catch (err) {
    // Even if it fails (security), we might want to show success or a generic error
    // But for dev, let's show detail
    error.value = err.response?.data?.message || "Échec du traitement de la demande."
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

.form-actions {
  text-align: center;
}

.back-link {
  color: var(--color-text-muted);
  text-decoration: none;
  font-size: 0.9rem;
}

.back-link:hover {
  text-decoration: underline;
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
