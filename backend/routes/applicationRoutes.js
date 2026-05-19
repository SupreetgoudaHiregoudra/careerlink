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
  applyToJob,
  getMyApplications,
  getApplicantsForJob,
  getApplicationById,
  updateStatus,
} = require("../controllers/applicationController");

// =========================================
// Apply For Job
// POST /api/applications/:jobId
// =========================================

router.post(
  "/:jobId",
  protect,
  applyToJob
);

// =========================================
// Get Logged In User Applications
// GET /api/applications/my
// =========================================

router.get(
  "/my",
  protect,
  getMyApplications
);

// =========================================
// Get Applicants For Specific Job
// GET /api/applications/job/:jobId
// =========================================

router.get(
  "/job/:jobId",
  protect,
  getApplicantsForJob
);

// =========================================
// Get Application By ID
// GET /api/applications/:id
// =========================================

router.get(
  "/:id",
  protect,
  getApplicationById
);

// =========================================
// Update Application Status
// PUT /api/applications/:id/status
// =========================================

router.put(
  "/:id/status",
  protect,
  updateStatus
);

// =========================================
// Export Router
// =========================================

module.exports = router;