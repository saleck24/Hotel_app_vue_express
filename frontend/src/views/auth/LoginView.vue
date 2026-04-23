<template>
  <AuthLayout>
    <div class="login-header">
      <h1 class="playfair">{{ $t('auth.welcome_back') }}</h1>
      <p class="subtitle">{{ $t('auth.login_subtitle') }}</p>
    </div>

    <form @submit.prevent="handleLogin" class="login-form">
      <BaseInput
        id="email"
        :label="$t('auth.email_label')"
        type="email"
        v-model="form.email"
        required
        placeholder="votre@exemple.com"
      >
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
        </template>
      </BaseInput>
      
      <BaseInput
        id="password"
        :label="$t('auth.password_label')"
        type="password"
        v-model="form.password"
        required
        placeholder="••••••••"
      >
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
        </template>
      </BaseInput>

      <div class="form-options">
        <label class="remember-me">
          <input type="checkbox" v-model="form.remember" />
          <span>{{ $t('auth.remember_me') }}</span>
        </label>
        <RouterLink to="/forgot-password" class="forgot-link">{{ $t('auth.forgot_password') }}</RouterLink>
      </div>

      <BaseButton type="submit" class="btn-submit" :loading="loading">
        {{ $t('auth.login_btn') }}
      </BaseButton>
    </form>

    <div class="auth-footer">
      <p>{{ $t('auth.new_here') }} <RouterLink to="/register">{{ $t('auth.create_account_free') }}</RouterLink></p>
    </div>
    
    <transition name="shake">
      <p v-if="error" class="error-message">{{ error }}</p>
    </transition>
  </AuthLayout>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'
import AuthLayout from '@/layouts/AuthLayout.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const form = reactive({
  email: '',
  password: '',
  remember: false
})

const loading = ref(false)
const error = ref('')

async function handleLogin() {
  loading.value = true
  error.value = ''
  
  try {
    await authStore.login(form)
    
    if (route.query.redirect) {
      router.push(route.query.redirect)
      return
    }

    if (authStore.isAdmin) {
      router.push('/admin')
    } else {
      router.push('/client')
    }
  } catch (err) {
    error.value = err.response?.data?.message || t('auth.login_error')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-header {
  margin-bottom: 2.5rem;
}

.login-header h1 {
  font-size: 2.25rem;
  color: var(--color-primary);
  margin-bottom: 0.75rem;
}

.subtitle {
  color: var(--color-text-muted);
  font-size: 0.95rem;
  line-height: 1.5;
}

.login-form {
  display: flex;
  flex-direction: column;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  font-size: 0.85rem;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: var(--color-text-muted);
}

.remember-me input {
  accent-color: var(--color-secondary);
}

.forgot-link {
  color: var(--color-secondary);
  font-weight: 600;
  text-decoration: none;
  transition: opacity 0.2s;
}

.forgot-link:hover {
  opacity: 0.8;
}

.btn-submit {
  padding: 0.9rem;
  font-size: 1rem;
  font-weight: 700;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--color-primary) 0%, #2c3e50 100%);
  box-shadow: 0 4px 15px rgba(26, 42, 68, 0.2);
  transition: all 0.3s;
}

.btn-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(26, 42, 68, 0.3);
}

.social-login {
  margin-top: 2.5rem;
}

.separator {
  position: relative;
  text-align: center;
  margin-bottom: 1.5rem;
}

.separator::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: #eee;
  z-index: 1;
}

.separator span {
  position: relative;
  z-index: 2;
  background-color: white;
  padding: 0 1rem;
  font-size: 0.85rem;
  color: #999;
}

.social-buttons {
  display: flex;
  gap: 1rem;
}

.social-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 1px solid #eee;
  border-radius: 12px;
  background-color: white;
  font-size: 0.9rem;
  font-weight: 600;
  color: #555;
  transition: all 0.2s;
}

.social-btn:hover {
  background-color: #f8fafc;
  border-color: #ddd;
}

.auth-footer {
  margin-top: 2.5rem;
  text-align: center;
  font-size: 0.95rem;
}

.auth-footer p {
  color: var(--color-text-muted);
}

.auth-footer a {
  color: var(--color-secondary);
  font-weight: 700;
  text-decoration: none;
}

.auth-footer a:hover {
  text-decoration: underline;
}

.error-message {
  color: #e05252;
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  background-color: #fff5f5;
  padding: 0.75rem;
  border-radius: 8px;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.shake-enter-active {
  animation: shake 0.4s ease-in-out;
}
</style>
