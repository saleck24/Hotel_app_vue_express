<template>
  <header class="navbar" :class="{ 'navbar--scrolled': isScrolled }">
    <div class="container navbar-content">
      <RouterLink to="/" class="brand">
        <div class="logo-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
        </div>
        <span class="brand-text">Hotel<span class="brand-accent">App</span></span>
      </RouterLink>

      <div class="nav-actions">
        <!-- Sélecteur de langue Custom -->
        <div class="lang-dropdown" v-click-outside="() => showLangMenu = false">
          <button @click="showLangMenu = !showLangMenu" class="lang-trigger">
            <span class="flag">{{ currentLang.flag }}</span>
            <span class="lang-code">{{ currentLang.code }}</span>
            <svg class="chevron" :class="{ open: showLangMenu }" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>
          
          <transition name="fade-slide">
            <div v-if="showLangMenu" class="lang-menu">
              <button 
                v-for="lang in languages" 
                :key="lang.id" 
                @click="changeLang(lang.id)"
                class="lang-item"
                :class="{ active: locale === lang.id }"
              >
                <span class="flag">{{ lang.flag }}</span>
                <span class="lang-name">{{ lang.name }}</span>
              </button>
            </div>
          </transition>
        </div>

        <template v-if="!authStore.isAuthenticated">
          <RouterLink to="/login" class="btn-login">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
            <span>{{ $t('nav.login') }}</span>
          </RouterLink>
          <RouterLink to="/register" class="btn-reserve">
            <span>{{ $t('nav.register') }}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          </RouterLink>
        </template>
        <template v-else>
          <div class="user-profile">
            <div class="user-info">
              <span class="user-name">{{ authStore.user?.nom }}</span>
              <span v-if="authStore.user?.points !== undefined" class="user-points">✨ {{ authStore.user.points }} pts</span>
            </div>
            <button @click="handleLogout" class="btn-logout">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            </button>
          </div>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const authStore = useAuthStore()
const router = useRouter()
const { locale } = useI18n()
const isScrolled = ref(false)
const showLangMenu = ref(false)

const languages = [
  { id: 'fr', name: 'Français', flag: '🇫🇷', code: 'FR' },
  { id: 'en', name: 'English', flag: '🇺🇸', code: 'EN' },
  { id: 'ar', name: 'العربية', flag: '🇲🇷', code: 'AR' }
]

const currentLang = computed(() => languages.find(l => l.id === locale.value) || languages[0])

function changeLang(id) {
  locale.value = id
  showLangMenu.value = false
}

// Directive simple pour fermer le menu au clic extérieur
const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}

function handleScroll() {
  isScrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>


<style scoped>
.navbar {
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
  height: 80px;
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.navbar--scrolled {
  height: 70px;
  background-color: rgba(255, 255, 255, 1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.navbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 2rem;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  transition: transform 0.2s;
}

.brand:hover {
  transform: scale(1.02);
}

.logo-icon {
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 10px rgba(var(--color-primary-rgb, 26, 42, 68), 0.2);
}

.brand-text {
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--color-primary);
  letter-spacing: -0.01em;
}

.brand-accent {
  color: var(--color-secondary);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.lang-dropdown {
  position: relative;
  margin-right: 0.5rem;
}

.lang-trigger {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background: rgba(248, 250, 252, 0.8);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(226, 232, 240, 0.8);
  padding: 0.5rem 1rem;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: var(--color-primary);
  font-weight: 700;
  font-size: 0.85rem;
  letter-spacing: 0.02em;
}

.lang-trigger:hover {
  background: white;
  border-color: var(--color-secondary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transform: translateY(-1px);
}

.lang-code {
  font-size: 0.8rem;
  opacity: 0.8;
}

.chevron {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  color: var(--color-text-muted);
  width: 14px;
  height: 14px;
}

.chevron.open {
  transform: rotate(180deg);
  color: var(--color-secondary);
}

.lang-menu {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(16px);
  border-radius: 18px;
  box-shadow: 0 15px 35px rgba(26, 42, 68, 0.12), 0 5px 15px rgba(0, 0, 0, 0.05);
  padding: 0.6rem;
  min-width: 170px;
  z-index: 1001;
  border: 1px solid rgba(241, 245, 249, 0.8);
  transform-origin: top right;
}

[dir="rtl"] .lang-menu {
  right: auto;
  left: 0;
  transform-origin: top left;
}

.lang-item {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.7rem 1rem;
  border: none;
  background: none;
  border-radius: 12px;
  cursor: pointer;
  color: var(--color-text);
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.lang-item:hover {
  background: var(--color-secondary-light, #fefce8);
  color: var(--color-secondary);
  padding-left: 1.25rem;
}

[dir="rtl"] .lang-item:hover {
  padding-left: 1rem;
  padding-right: 1.25rem;
}

.lang-item.active {
  background: #f1f5f9;
  color: var(--color-primary);
  font-weight: 700;
}

.lang-item.active::after {
  content: "";
  width: 6px;
  height: 6px;
  background: var(--color-secondary);
  border-radius: 50%;
}

.flag {
  font-size: 1.2rem;
  margin-right: 0.2rem;
}

[dir="rtl"] .flag {
  margin-right: 0;
  margin-left: 0.2rem;
}

/* Animations */
.fade-slide-enter-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.fade-slide-leave-active {
  transition: all 0.2s ease-in;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-12px) scale(0.95);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
}




.btn-login {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-primary);
  font-weight: 600;
  text-decoration: none;
  padding: 0.6rem 1rem;
  border-radius: 10px;
  transition: all 0.2s;
}

.btn-login:hover {
  background-color: #f8fafc;
  color: var(--color-secondary);
}

.btn-reserve {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background: linear-gradient(135deg, var(--color-secondary) 0%, #d4a017 100%);
  color: white;
  font-weight: 700;
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(212, 160, 23, 0.2);
  transition: all 0.3s;
}

.btn-reserve:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(212, 160, 23, 0.3);
  filter: brightness(1.05);
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 1rem;
  background-color: #f8fafc;
  padding: 0.5rem 1rem;
  border-radius: 15px;
  border: 1px solid #eef2f6;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--color-primary);
}

.user-points {
  font-size: 0.75rem;
  font-weight: 800;
  color: var(--color-secondary);
}

.btn-logout {
  background: none;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  padding: 0.4rem;
  border-radius: 8px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-logout:hover {
  background-color: #fee2e2;
  color: #ef4444;
}

@media (max-width: 768px) {
  .brand-text {
    display: none;
  }
  .navbar-content {
    padding: 0 1rem;
  }
}
</style>
