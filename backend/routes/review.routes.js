const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const { verifyToken } = require("../middleware/auth.middleware");
const checkRole = require("../middleware/role.middleware");
const {
  createReview,
  getReviewsByRoom,
  getReviewsByUser
} = require("../controllers/reviews.controller");

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Feedbacks des clients sur les chambres
 */

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Laisser un feedback après une réservation confirmée (CLIENT)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reservation_id
 *               - note
 *             properties:
 *               reservation_id:
 *                 type: integer
 *                 example: 12
 *               note:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               commentaire:
 *                 type: string
 *                 example: "Excellent séjour, chambre très propre"
 *     responses:
 *       201:
 *         description: Feedback enregistré avec succès
 *       400:
 *         description: Réservation non confirmée ou données invalides
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Réservation introuvable
 */
router.post(
  "/",
  verifyToken,
  checkRole("CLIENT"),

  [
    body("reservation_id")
      .isInt().withMessage("Reservation invalide"),

    body("note")
      .isInt({ min: 1, max: 5 })
      .withMessage("La note doit être entre 1 et 5"),

    body("commentaire")
      .optional()
      .isString().withMessage("Commentaire invalide"),
  ],

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },

  createReview
);

/**
 * @swagger
 * /api/reviews/room/{roomId}:
 *   get:
 *     summary: Récupérer tous les feedbacks d'une chambre (ADMIN + CLIENT)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des feedbacks
 */
router.get("/room/:roomId", verifyToken, checkRole("ADMIN", "CLIENT"), getReviewsByRoom);

/**
 * @swagger
 * /api/reviews/me:
 *   get:
 *     summary: Récupérer ses propres feedbacks (CLIENT)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des feedbacks du client
 */
router.get("/me", verifyToken, checkRole("CLIENT"), getReviewsByUser);

module.exports = router;
