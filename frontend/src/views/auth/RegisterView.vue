<template>
  <div class="auth-wrapper">
    <div class="auth-card">
      <div class="auth-header">
        <h1 class="text-heading">Créer un compte</h1>
        <p>Rejoignez-nous pour réserver votre séjour idéal</p>
      </div>

      <form @submit.prevent="handleRegister">
        <BaseInput
          id="name"
          label="Nom complet"
          type="text"
          v-model="form.nom"
          required
          placeholder="Jean Dupont"
        />

        <BaseInput
          id="email"
          label="Adresse e-mail"
          type="email"
          v-model="form.email"
          required
          placeholder="votre@exemple.com"
        />
        
        <BaseInput
          id="password"
          label="Mot de passe"
          type="password"
          v-model="form.password"
          required
          placeholder="Min. 8 caractères"
        />

        <BaseButton type="submit" class="w-full" :loading="loading">
          S'inscrire
        </BaseButton>
      </form>

      <div class="auth-footer">
        <p>Déjà un compte ? <RouterLink to="/login">Se connecter</RouterLink></p>
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
  nom: '',
  email: '',
  password: ''
})

const loading = ref(false)
const error = ref('')

async function handleRegister() {
  loading.value = true
  error.value = ''
  
  try {
    await authStore.register(form)
    // After register, redirect to login or auto-login
    // Assuming API requires login after register
    router.push('/login')
  } catch (err) {
    error.value = err.response?.data?.message || "Échec de l'inscription. Réessayez."
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Reusing same styles as LoginView. 
   In a larger app, we'd extract the AuthLayout or shared CSS. 
*/
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
