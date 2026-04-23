# Hotel_App - Application de gestion d'hôtel Premium

**Hotel_App** est une plateforme hôtelière moderne et complète développée avec **Express.js** et **Vue.js 3**. Elle offre une expérience utilisateur riche avec un support multilingue, un système de fidélité et des notifications en temps réel.

---

## 🛠 Technologies & Architecture

- **Backend :** Node.js, Express.js, Socket.io
- **Frontend :** Vue.js 3 (Composition API), Vite, Pinia, Vue-i18n
- **Base de données :** MySQL
- **Design :** CSS Moderne, Glassmorphism, Animations fluides
- **Internationalisation :** Support i18n (FR, EN, AR) avec gestion du mode **RTL** (droite à gauche)

---

## ⚙️ Fonctionnalités Phares

### 🌍 Internationalisation & UX Premium
- **Sélecteur de langue dynamique** : Basculement instantané entre Français, Anglais et Arabe.
- **Support RTL** : Inversion automatique de l'interface pour l'arabe (Sidebars, Navbars, Grilles).
- **Design de pointe** : Utilisation du glassmorphism, transitions CSS avancées et typographies raffinées.

### 💎 Système de Fidélité
- **Points cumulés** : Chaque réservation confirmée rapporte des points à l'utilisateur (ratio : 1pt pour 100 MRU dépensés).
- **Affichage en temps réel** : Solde de points visible dans la barre de navigation.

### ⚡ Notifications Temps Réel
- **Alertes Admin** : L'administrateur reçoit une notification instantanée via Socket.io lors d'une nouvelle réservation, sans recharger la page.
- **Toasts Premium** : Système de notifications visuelles élégantes pour les alertes système.

### 📸 Galerie d'Images Interactive
- **Slideshow intégré** : Balayage intuitif des photos des chambres directement sur les cartes de présentation.

### 💬 Chat & Support
- Discussion en temps réel entre l’administrateur et les clients via WebSocket.

### 🔐 Sécurité & Profil
- Authentification JWT (JSON Web Tokens).
- Gestion de profil utilisateur et historique complet des réservations.

---

## 🚀 Installation

1. **Cloner le projet :**
   ```bash
   git clone https://github.com/<votre-username>/Hotel_App.git
   ```

2. **Backend :**
   ```bash
   cd backend
   npm install
   # Configurer le fichier .env
   node migrate_loyalty.js # Pour ajouter la colonne points
   npm start
   ```

3. **Frontend :**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

---

## 📄 Licence
Propriété de HotelApp 2026. Tous droits réservés.
