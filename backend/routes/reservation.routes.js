const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");

const {
  createReservation,
  getMyReservations,
  getPendingReservations,
  validerReservation,
  annulerReservation
} = require("../controllers/reservations.controller");

const { verifyToken } = require("../middleware/auth.middleware");
const checkRole = require("../middleware/role.middleware");



/**
 * @swagger
 * tags:
 *   name: Reservations
 *   description: Gestion des réservations
 */

/**
 * @swagger
 * /api/reservations:
 *   post:
 *     summary: Créer une réservation (CLIENT)
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - chambre_id
 *               - date_debut
 *               - date_fin
 *             properties:
 *               chambre_id:
 *                 type: integer
 *               date_debut:
 *                 type: string
 *                 format: date
 *               date_fin:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Réservation créée
 *       400:
 *         description: Données invalides
 */
// CLIENT
router.post(
  "/",
  verifyToken,
  checkRole("CLIENT"),
  [
    body("chambre_id").isInt().withMessage("Chambre invalide"),
    body("date_debut").isISO8601().withMessage("Date de début invalide, format attendu : YYYY-MM-DD"),
    body("date_fin").isISO8601().withMessage("Date de fin invalide, format attendu : YYYY-MM-DD"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  createReservation
);


/**
 * @swagger
 * /api/reservations/mes-reservations:
 *   get:
 *     summary: Récupérer ses propres réservations (CLIENT)
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des réservations de l'utilisateur
 */
router.get("/mes-reservations", verifyToken, checkRole("CLIENT"), getMyReservations);


/**
 * @swagger
 * /api/reservations/en-attente:
 *   get:
 *     summary: Récupérer les réservations en attente (ADMIN)
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des réservations en attente
 */
// ADMIN
router.get("/en-attente", verifyToken, checkRole("ADMIN"), getPendingReservations);

// Récupérer toutes les réservations (ADMIN)
router.get("/", verifyToken, checkRole("ADMIN"), (req, res, next) => {
  // Distinguer du POST / basé sur la méthode et le rôle
  // C'est assez générique car le POST est géré au-dessus
  const { getAllReservations } = require("../controllers/reservations.controller");
  return getAllReservations(req, res);
});

// Annuler réservation (ADMIN)
router.put("/:id/annuler-admin", verifyToken, checkRole("ADMIN"), (req, res, next) => {
  const { annulerReservationAdmin } = require("../controllers/reservations.controller");
  return annulerReservationAdmin(req, res);
});


/**
 * @swagger
 * /api/reservations/{id}/valider:
 *   put:
 *     summary: Valider une réservation (ADMIN)
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Réservation validée
 */
// ADMIN
router.put("/:id/valider", verifyToken, checkRole("ADMIN"), validerReservation);


/**
 * @swagger
 * /api/reservations/{id}/annuler:
 *   put:
 *     summary: Annuler sa réservation (CLIENT)
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Réservation annulée
 *       404:
 *         description: Réservation non trouvée ou non autorisée
 */
router.put("/:id/annuler", verifyToken, checkRole("CLIENT"), annulerReservation);


module.exports = router;
