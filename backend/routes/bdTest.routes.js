const express = require("express");
const router = express.Router();
const bdTestController = require("../controllers/bdTest.controller");


/**
 * @swagger
 * tags:
 *   name: Test
 *   description: Tests backend
 */

/**
 * @swagger
 * /api/bd-test:
 *   get:
 *     summary: Test connexion MySQL
 *     tags: [Test]
 *     responses:
 *       200:
 *         description: Connexion OK
 */
router.get("/bd-test", bdTestController.testBd);

module.exports = router;
