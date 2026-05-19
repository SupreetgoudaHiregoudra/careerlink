const SavedJob = require("../models/SavedJob");
const Application = require("../models/Application");
const Job = require("../models/Job");

// =========================================
// @desc    Save a job
// @route   POST /api/saved-jobs/:jobId
// @access  Private (Jobseeker)
// =========================================

exports.saveJob = async (req, res) => {
  try {
    // Role check
    if (req.user.role !== "jobseeker") {
      return res.status(403).json({
        success: false,
        message: "Only job seekers can save jobs",
      });
    }

    // Check if job exists
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Check if already saved
    const exists = await SavedJob.findOne({
      job: req.params.jobId,
      jobseeker: req.user._id,
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Job already saved",
      });
    }

    // Save job
    const saved = await SavedJob.create({
      job: req.params.jobId,
      jobseeker: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Job saved successfully",
      savedJob: saved,
    });
  } catch (err) {
    console.error("Save Job Error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to save job",
      error: err.message,
    });
  }
};

// =========================================
// @desc    Unsave a job
// @route   DELETE /api/saved-jobs/:jobId
// @access  Private (Jobseeker)
// =========================================

exports.unsaveJob = async (req, res) => {
  try {
    // Role check
    if (req.user.role !== "jobseeker") {
      return res.status(403).json({
        success: false,
        message: "Only job seekers can unsave jobs",
      });
    }

    // Remove saved job
    const removed = await SavedJob.findOneAndDelete({
      job: req.params.jobId,
      jobseeker: req.user._id,
    });

    if (!removed) {
      return res.status(404).json({
        success: false,
        message: "Saved job not found",
      });
    }

    res.json({
      success: true,
      message: "Job removed from saved list",
    });
  } catch (err) {
    console.error("Unsave Job Error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to remove saved job",
      error: err.message,
    });
  }
};

// =========================================
// @desc    Get saved jobs for current user
// @route   GET /api/saved-jobs
// @access  Private (Jobseeker)
// =========================================

exports.getMySavedJobs = async (req, res) => {
  try {
    // Role check
    if (req.user.role !== "jobseeker") {
      return res.status(403).json({
        success: false,
        message: "Only job seekers can access saved jobs",
      });
    }

    // Fetch saved jobs
    const savedJobs = await SavedJob.find({
      jobseeker: req.user._id,
    })
      .populate({
        path: "job",
        populate: {
          path: "company",
          select: "name companyName companyLogo",
        },
      })
      .sort({ createdAt: -1 });

    // Get valid job IDs
    const jobIds = savedJobs
      .map((item) => item?.job?._id)
      .filter(Boolean);

    // Fetch applications
    const applications = await Application.find({
      applicant: req.user._id,
      job: { $in: jobIds },
    }).select("job status");

    // Create status map
    const applicationStatusMap =
      applications.reduce((acc, app) => {
        acc[String(app.job)] = app.status;
        return acc;
      }, {});

    // Add application status to jobs
    const savedJobsWithStatus = savedJobs.map(
      (item) => {
        const entry = item.toObject();

        if (entry.job?._id) {
          entry.job.applicationStatus =
            applicationStatusMap[
              String(entry.job._id)
            ] || null;
        }

        return entry;
      }
    );

    res.json({
      success: true,
      count: savedJobsWithStatus.length,
      savedJobs: savedJobsWithStatus,
    });
  } catch (err) {
    console.error("Get Saved Jobs Error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch saved jobs",
      error: err.message,
    });
  }
};