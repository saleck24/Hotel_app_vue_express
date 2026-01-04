const express = require("express");
const router = express.Router();

const { sendMessage, getMessages } = require("../controllers/message.controller");
const { verifyToken } = require("../middleware/auth.middleware");
const checkRole = require("../middleware/role.middleware");



/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: Gestion des messages privés
 */

/**
 * @swagger
 * /api/messages:
 *   post:
 *     summary: Envoyer un message
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               to_user_id:
 *                 type: int
 *               message:
 *                 type: text
 *     responses:
 *       201:
 *         description: Message envoyé
 */
// Envoyer un message
router.post("/", verifyToken, sendMessage);


/**
 * @swagger
 * /api/messages/{userId}:
 *   get:
 *     summary: Récupérer l'historique des messages avec un utilisateur
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Historique des messages
 */
// Récupérer l'historique avec un utilisateur
router.get("/:userId", verifyToken, getMessages);

module.exports = router;
