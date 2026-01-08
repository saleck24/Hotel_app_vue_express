const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const createUploader = require("../middleware/uploads.middleware");

const {
  createRoom,
  getRooms,
  getRoomById,
  updateRoom,
  deleteRoom
} = require("../controllers/rooms.controller");

const { verifyToken } = require("../middleware/auth.middleware");
const checkRole = require("../middleware/role.middleware");
//const upload = require("../middleware/uploads.middleware");

/**
 * @swagger
 * tags:
 *   name: Rooms
 *   description: Gestion des chambres d'hôtel
 */

/**
 * @swagger
 * /api/rooms:
 *   post:
 *     summary: Créer une chambre (ADMIN uniquement)
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - numero
 *               - type
 *               - prix
 *               - capacite
 *               - statut
 *             properties:
 *               numero:
 *                 type: string
 *                 example: "101"
 *               type:
 *                 type: string
 *                 example: "Double"
 *               prix:
 *                 type: number
 *                 example: 15000
 *               capacite:
 *                 type: integer
 *                 example: 2
 *               statut:
 *                 type: string
 *                 enum: [DISPONIBLE, INDISPONIBLE]
 *               description:
 *                 type: string
 *                 example: "Chambre climatisée avec balcon"
 *               images:
 *                 type: array
 *                 maxItems: 3
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Chambre créée avec succès
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès interdit
 */
// ADMIN uniquement
const uploadRooms = createUploader("rooms");
router.post(
  "/",
  verifyToken,
  checkRole("ADMIN"),
  uploadRooms.array("images", 3),
  [
    body("numero")
      .notEmpty().withMessage("Le numéro est requis")
      .isString().withMessage("Numéro invalide"),
    body("type")
      .notEmpty().withMessage("Le type est requis")
      .isString().withMessage("Type invalide"),
    body("prix")
      .notEmpty().withMessage("Le prix est requis")
      .isFloat({ min: 0 }).withMessage("Prix invalide"),
    body("capacite")
      .notEmpty().withMessage("La capacité est requise")
      .isInt({ min: 1 }).withMessage("Capacité invalide"),
    body("statut")
      .notEmpty().withMessage("Le statut est requis")
      .isIn(["DISPONIBLE", "INDISPONIBLE"])
      .withMessage("Statut invalide")
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Au moins une image est requise" });
    }
    next();
  },
  createRoom
);

/**
 * @swagger
 * /api/rooms/{id}:
 *   put:
 *     summary: Mettre à jour une chambre (ADMIN uniquement)
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identifiant unique de la chambre
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               numero:
 *                 type: string
 *               type:
 *                 type: string
 *               prix:
 *                 type: number
 *               capacite:
 *                 type: number
 *               statut:
 *                 type: string
 *               description:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 maxItems: 3
 *     responses:
 *       200:
 *         description: Chambre mise à jour avec succès
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé (ADMIN uniquement)
 *       500:
 *         description: Erreur serveur
 */
// ADMIN uniquement
router.put("/:id", verifyToken, checkRole("ADMIN"), uploadRooms.array("images", 3), updateRoom);

/**
 * @swagger
 * /api/rooms/{id}:
 *   delete:
 *     summary: Supprimer une chambre (ADMIN uniquement)
 *     tags: [Rooms]
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
 *         description: Chambre supprimée
 */
// ADMIN uniquement
router.delete("/:id", verifyToken, checkRole("ADMIN"), deleteRoom);

/**
 * @swagger
 * /api/rooms:
 *   get:
 *     summary: Récupérer toutes les chambres (ADMIN et CLIENT)
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des chambres
 */
// CLIENT + ADMIN
router.get("/", verifyToken, checkRole("ADMIN", "CLIENT"), getRooms);

/**
 * @swagger
 * /api/rooms/{id}:
 *   get:
 *     summary: Récupérer une chambre par ID
 *     tags: [Rooms]
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
 *         description: Détails de la chambre
 */
// CLIENT + ADMIN
router.get("/:id", verifyToken, checkRole("ADMIN", "CLIENT"), getRoomById);

module.exports = router;
