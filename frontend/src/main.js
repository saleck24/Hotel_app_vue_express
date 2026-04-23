import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

import './assets/main.css';
import i18n from './i18n';
import { loadUser } from './stores/user';

// === Charger l'utilisateur depuis localStorage ===
loadUser();


// === Création de l'app Vue ===
const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(i18n);

app.mount('#app');

