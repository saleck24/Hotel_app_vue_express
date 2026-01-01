# Hotel App

**Hotel App** est une application web de gestion d'hôtel complète, permettant aux administrateurs et clients de gérer les 
chambres, les réservations et les communications en temps réel. Le projet utilise **Vue 3** pour le frontend et **Node.js / Express** 
pour le backend avec une base de données MySQL. Il intègre également des fonctionnalités avancées comme les emails automatiques, 
la réinitialisation de mot de passe et les statistiques pour l’admin.

---

## Fonctionnalités

### A. Gestion des utilisateurs
- Créer un utilisateur (POST `/api/users`)
- Lister tous les utilisateurs (GET `/api/users`)
- Authentification et gestion des sessions (admin / user)
- Sécurisation des routes admin avec JWT (jsonwebtoken)

### B. Gestion des chambres
- Ajouter, modifier et supprimer une chambre (uniquement admin)
- Lister toutes les chambres (admin + client)
- Table `chambres` : `id`, `numero`, `type`, `prix`, `disponible`, etc.

### C. Gestion des réservations
- Créer une réservation (client)
- Modifier / Annuler une réservation (client ou admin selon les droits)
- Lister les réservations (admin : toutes, client : les siennes)
- Ajouter un feedback à une réservation (client)
- Table `reservations` : `id`, `id_user`, `id_chambre`, `date_debut`, `date_fin`, `etat` (payé, validé, annulé), etc.
- Table `feedbacks` : `id`, `id_reservation`, `note`, `commentaire`, `created_at`

### D. Gestion des emails
- Envoi automatique d’email avec PDF lors de la validation d’une réservation par l’admin
- Sécurisation des credentials email via variables d’environnement (`EMAIL_USER`, `EMAIL_PASS`)

### E. Statistiques (Admin)
- Taux d’occupation (chambres réservées / chambres totales)
- Revenus totaux
- Avis clients (moyenne et nombre d’avis)

### F. Discussion en temps réel
- Chat admin-client en temps réel avec WebSocket (`socket.io`)
- Notifications automatiques lorsque le client clique “payer sur WhatsApp”
- Validation du paiement par l’admin → déclenchement d’un email avec reçu PDF

---


