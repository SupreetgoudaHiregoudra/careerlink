const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");
const SavedJob = require("../models/SavedJob");

// =========================================
// Admin Dashboard Stats
// =========================================

exports.getAdminStats = async (
  req,
  res
) => {
  try {
    const totalUsers =
      await User.countDocuments();

    const totalEmployers =
      await User.countDocuments({
        role: "employer",
      });

    const totalJobseekers =
      await User.countDocuments({
        role: "jobseeker",
      });

    const totalJobs =
      await Job.countDocuments();

    const totalApplications =
      await Application.countDocuments();

    const totalSavedJobs =
      await SavedJob.countDocuments();

    res.json({
      success: true,

      stats: {
        totalUsers,
        totalEmployers,
        totalJobseekers,
        totalJobs,
        totalApplications,
        totalSavedJobs,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
// =========================================
// GET ALL USERS
// =========================================

const getAllUsers = async (
  req,
  res
) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      users,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =========================================
// DELETE USER
// =========================================

const deleteUser = async (
  req,
  res
) => {
  try {
    const user =
      await User.findById(
        req.params.id
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await user.deleteOne();

    res.json({
      success: true,
      message: "User deleted",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =========================================
// GET ALL JOBS
// =========================================

const getAllJobs = async (
  req,
  res
) => {
  try {
    const jobs = await Job.find()
      .populate(
        "company",
        "companyName email"
      )
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      jobs,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =========================================
// DELETE JOB
// =========================================

const deleteJob = async (
  req,
  res
) => {
  try {
    const job =
      await Job.findById(
        req.params.id
      );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    await job.deleteOne();

    res.json({
      success: true,
      message: "Job deleted",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  getAdminStats:
    exports.getAdminStats,

  getAllUsers,

  deleteUser,

  getAllJobs,

  deleteJob,
};