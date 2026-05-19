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
  saveJob,
  unsaveJob,
  getMySavedJobs,
} = require("../controllers/savedJobController");

// =========================================
// SAVE JOB ROUTES
// =========================================

// Save a job
// POST /api/saved-jobs/:jobId
router.post(
  "/:jobId",
  protect,
  saveJob
);

// Remove saved job
// DELETE /api/saved-jobs/:jobId
router.delete(
  "/:jobId",
  protect,
  unsaveJob
);

// Get logged-in user's saved jobs
// GET /api/saved-jobs/my
router.get(
  "/my",
  protect,
  getMySavedJobs
);

// =========================================
// Export Router
// =========================================

module.exports = router;