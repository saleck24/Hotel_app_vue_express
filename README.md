# Hotel_App - Application de gestion d'hôtel

**Hotel_App** est une application web de gestion d'hôtel développée avec **Express.js** pour le backend et **Vue.js + Vite** pour le frontend.
Elle permet aux administrateurs de gérer les chambres, valider les réservations, visualiser des statistiques et discuter avec les clients via un chat en temps réel.

---

## 🛠 Technologies utilisées

- **Backend :** Node.js, Express.js  
- **Frontend :** Vue.js + Vite, HTML, CSS, JavaScript  
- **Base de données :** MySQL  
- **Chat en temps réel :** WebSocket  
- **IDE de développement :** Visual Studio Code  
- **Serveur local :** WampServer (MySQL)

---

## ⚙️ Fonctionnalités principales

### Gestion des chambres
- Ajouter, modifier et supprimer des chambres  
- Visualiser toutes les chambres avec détails : numéro, type, prix, capacité, statut, description  

### Gestion des réservations
- Visualiser les réservations en attente  
- Valider les réservations directement depuis le dashboard  
- Suivi du statut des réservations : `EN_ATTENTE`, `CONFIRMEE`  

### Statistiques
- Taux d’occupation des chambres  
- Revenus totaux générés  
- Avis clients : moyenne et nombre d'avis  

### Chat Admin
- Discussion en temps réel entre l’administrateur et les clients  

### Sécurité
- Authentification des utilisateurs  
- Gestion des sessions pour sécuriser l’accès aux pages administratives  

---

## 🚀 Installation et configuration

1. **Cloner le projet :**
```bash
git clone https://github.com/<votre-username>/Hotel_App.git
