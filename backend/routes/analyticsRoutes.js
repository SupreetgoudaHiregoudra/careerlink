const express = require("express");

const router = express.Router();

// =========================================
// Middleware
// =========================================

const {
  protect,
} = require("../middleware/authMiddleware");

// =========================================
// Controllers
// =========================================

const {
  getEmployerAnalytics,
  getPublicStats,
} = require("../controllers/analyticsController");

// =========================================
// Routes
// =========================================

// Public platform statistics
// GET /api/analytics/public-stats
router.get(
  "/public-stats",
  getPublicStats
);

// Employer dashboard analytics
// GET /api/analytics/overview
router.get(
  "/overview",
  protect,
  getEmployerAnalytics
);

// =========================================
// Export Router
// =========================================

module.exports = router;