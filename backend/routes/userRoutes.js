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
  updateProfile,
  deleteResume,
  getPublicProfile,
} = require("../controllers/userController");

// =========================================
// USER ROUTES
// =========================================

// Update user profile
// PUT /api/users/profile
router.put(
  "/profile",
  protect,
  updateProfile
);

// Delete resume
// DELETE /api/users/resume
router.delete(
  "/resume",
  protect,
  deleteResume
);

// =========================================
// PUBLIC ROUTES
// =========================================

// Get public profile
// GET /api/users/:id
router.get(
  "/:id",
  getPublicProfile
);

// =========================================
// Export Router
// =========================================

module.exports = router;