<<<<<<< Updated upstream
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { useDark } from '@vueuse/core';

import './assets/main.css';
import { loadUser } from './stores/user';


// === Dark Mode ===
// On crée un ref réactif qui lit/écrit dans localStorage avec la clé "theme"
const isDark = useDark({ storageKey: 'theme' });

// Appliquer la classe dark dès le départ
if (isDark.value) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

// === Charger l'utilisateur depuis localStorage ===
loadUser();


// === Création de l'app Vue ===
const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');
=======
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/css/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
>>>>>>> Stashed changes
