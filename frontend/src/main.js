import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

import './assets/main.css';
import { loadUser } from './stores/user';

// === Charger l'utilisateur depuis localStorage ===
loadUser();


// === Création de l'app Vue ===
const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');
