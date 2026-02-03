const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users.controller");
const { verifyToken, isAdmin } = require("../middleware/auth.middleware");
const checkRole = require("../middleware/role.middleware");
const createUploader = require("../middleware/uploads.middleware");


/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentification et réinitialisation de mot de passe 
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Inscription d’un client
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nom
 *               - email
 *               - password
 *             properties:
 *               nom:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Compte client créé
 *       409:
 *         description: Email déjà utilisé
 */
// Inscription client (publique)
router.post("/auth/register", usersController.createClient);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Connexion utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login réussi avec JWT
 *       401:
 *         description: Mot de passe incorrect
 */
// Login (public)
router.post("/auth/login", usersController.login);

// Logout
router.post("/auth/logout", usersController.logout);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Demande de réinitialisation de mot de passe
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: client@email.com
 *     responses:
 *       200:
 *         description: Lien de réinitialisation généré
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */
//Route mot de passe oublié
router.post("/auth/forgot-password", usersController.forgotPassword);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Réinitialisation du mot de passe avec token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 example: "abcd1234token"
 *               newPassword:
 *                 type: string
 *                 example: "NouveauMotDePasse123"
 *     responses:
 *       200:
 *         description: Mot de passe réinitialisé avec succès
 *       400:
 *         description: Token invalide ou expiré
 *       500:
 *         description: Erreur serveur
 */
//Route réinitialiser mot de passe 
router.post("/auth/reset-password", usersController.resetPassword);


/**
 * @swagger
 * /api/admin/create:
 *   post:
 *     summary: Créer un admin (ADMIN seulement)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nom
 *               - email
 *               - password
 *             properties:
 *               nom:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Admin créé
 *       403:
 *         description: Accès interdit
 */
// Création admin (protégée)
router.post(
  "/admin/create",
  verifyToken,
  checkRole("ADMIN"),
  usersController.createAdmin
);


/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Lister tous les utilisateurs
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 */
// Lister les utilisateurs seul admin peut y accéder
router.get(
  "/users",
  verifyToken,
  checkRole("ADMIN"),
  usersController.getAllUsers
);

// Lister les admins (accessible par tous pour le chat)
router.get(
  "/admins",
  verifyToken,
  usersController.getAdmins
);


/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Modifier le profil utilisateur
 *     description: |
 *       Permet à un utilisateur authentifié de modifier son profil.
 *       - Mise à jour du nom
 *       - Upload d'une image de profil
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               profile_image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profil mis à jour avec succès
 *       401:
 *         description: Non autorisé (token manquant ou invalide)
 *       500:
 *         description: Erreur serveur
 */
//Route pour modifier le profile
const uploadProfiles = createUploader("profiles");
router.put(
  "/users/profile",
  verifyToken,
  checkRole("ADMIN", "CLIENT"),
  uploadProfiles.single("profile_image"),
  usersController.updateProfile
);

module.exports = router;
