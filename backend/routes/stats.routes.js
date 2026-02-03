const express = require("express");
const router = express.Router();
const { getDashboardStats } = require("../controllers/stats.controller");
const { verifyToken } = require("../middleware/auth.middleware");
const checkRole = require("../middleware/role.middleware");

// GET /api/stats/dashboard (ADMIN ONLY)
router.get("/dashboard", verifyToken, checkRole("ADMIN"), getDashboardStats);

module.exports = router;
