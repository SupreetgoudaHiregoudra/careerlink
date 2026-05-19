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
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  toggleCloseJob,
  getJobsEmployer,
} = require("../controllers/jobController");

// =========================================
// JOB ROUTES
// =========================================

// Create Job
// Get All Jobs
// POST /api/jobs
// GET /api/jobs
router
  .route("/")
  .post(
    protect,
    createJob
  )
  .get(getJobs);

// =========================================
// EMPLOYER JOBS
// =========================================

// Get Employer Jobs
// GET /api/jobs/get-jobs-employer
router.get(
  "/get-jobs-employer",
  protect,
  getJobsEmployer
);

// =========================================
// SINGLE JOB ROUTES
// =========================================

// Get Job By ID
// Update Job
// Delete Job
//
// GET    /api/jobs/:id
// PUT    /api/jobs/:id
// DELETE /api/jobs/:id

router
  .route("/:id")
  .get(getJobById)
  .put(
    protect,
    updateJob
  )
  .delete(
    protect,
    deleteJob
  );

// =========================================
// TOGGLE JOB STATUS
// =========================================

// Toggle Close/Reopen Job
// PUT /api/jobs/:id/toggle-close

router.put(
  "/:id/toggle-close",
  protect,
  toggleCloseJob
);

// =========================================
// Export Router
// =========================================

module.exports = router;