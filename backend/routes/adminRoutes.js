const express = require("express");

const router = express.Router();

const {
  protect,
} = require("../middleware/authMiddleware");

const adminMiddleware = require(
  "../middleware/adminMiddleware"
);

const {
  getAllUsers,
  deleteUser,
  getAllJobs,
  deleteJob,
  getAdminStats,
} = require("../controllers/adminController");

router.get(
  "/stats",
  protect,
  getAdminStats
);

// USERS

router.get(
  "/users",
  protect,
  adminMiddleware,
  getAllUsers
);

router.delete(
  "/users/:id",
  protect,
  adminMiddleware,
  deleteUser
);

// JOBS

router.get(
  "/jobs",
  protect,
  adminMiddleware,
  getAllJobs
);

router.delete(
  "/jobs/:id",
  protect,
  adminMiddleware,
  deleteJob
);

module.exports = router;