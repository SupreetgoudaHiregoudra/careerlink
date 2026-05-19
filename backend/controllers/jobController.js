const Job = require("../models/Job");
const User = require("../models/User");
const Application = require("../models/Application");
const SavedJob = require("../models/SavedJob");

// =========================================
// Normalize Categories
// =========================================

const normalizeCategories = (value) => {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value
      .map((item) => String(item || "").trim())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

// =========================================
// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private (Employer)
// =========================================

exports.createJob = async (req, res) => {
  try {
    // Role check
    if (req.user.role !== "employer") {
      return res.status(403).json({
        success: false,
        message: "Only employers can post jobs",
      });
    }

    const categories = normalizeCategories(
      req.body.category || req.body.categories
    );

    const payload = {
      ...req.body,
      company: req.user._id,
      category: categories,
    };

    const job = await Job.create(payload);

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      job,
    });
  } catch (err) {
    console.error("Create Job Error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to create job",
      error: err.message,
    });
  }
};

// =========================================
// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
// =========================================

exports.getJobs = async (req, res) => {
  try {
    const {
      keyword,
      location,
      category,
      type,
      minSalary,
      maxSalary,
      userId,
    } = req.query;

    const categories = normalizeCategories(category);

    const query = {
      isClosed: false,

      ...(keyword && {
        title: {
          $regex: keyword,
          $options: "i",
        },
      }),

      ...(location && {
        location: {
          $regex: location,
          $options: "i",
        },
      }),

      ...(categories.length > 0 && {
        category: { $in: categories },
      }),

      ...(type && { type }),
    };

    // Salary filter
    if (minSalary || maxSalary) {
      query.$and = [];

      if (minSalary) {
        query.$and.push({
          salaryMax: {
            $gte: Number(minSalary),
          },
        });
      }

      if (maxSalary) {
        query.$and.push({
          salaryMin: {
            $lte: Number(maxSalary),
          },
        });
      }

      if (query.$and.length === 0) {
        delete query.$and;
      }
    }

    // Fetch jobs
    const jobs = await Job.find(query)
      .populate(
        "company",
        "name companyName companyLogo"
      )
      .sort({ createdAt: -1 });

    let savedJobIds = [];
    let appliedJobStatusMap = {};

    // Logged-in user extras
    if (userId) {
      // Saved jobs
      const savedJobs = await SavedJob.find({
        jobseeker: userId,
      }).select("job");

      savedJobIds = savedJobs.map((s) =>
        String(s.job)
      );

      // Applications
      const applications = await Application.find({
        applicant: userId,
      }).select("job status");

      applications.forEach((app) => {
        appliedJobStatusMap[String(app.job)] =
          app.status;
      });
    }

    // Add extra fields
    const jobsWithExtras = jobs.map((job) => {
      const jobIdStr = String(job._id);

      return {
        ...job.toObject(),

        isSaved:
          savedJobIds.includes(jobIdStr),

        applicationStatus:
          appliedJobStatusMap[jobIdStr] || null,
      };
    });

    res.json({
      success: true,
      count: jobsWithExtras.length,
      jobs: jobsWithExtras,
    });
  } catch (err) {
    console.error("Get Jobs Error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
      error: err.message,
    });
  }
};

// =========================================
// @desc    Get employer jobs
// @route   GET /api/jobs/employer
// @access  Private (Employer)
// =========================================

exports.getJobsEmployer = async (req, res) => {
  try {
    const userId = req.user._id;

    if (req.user.role !== "employer") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // Fetch employer jobs
    const jobs = await Job.find({
      company: userId,
    })
      .populate(
        "company",
        "name companyName companyLogo"
      )
      .sort({ createdAt: -1 })
      .lean();

    // Add application count
    const jobsWithApplicationCounts =
      await Promise.all(
        jobs.map(async (job) => {
          const applicationCount =
            await Application.countDocuments({
              job: job._id,
            });

          return {
            ...job,
            applicationCount,
          };
        })
      );

    res.json({
      success: true,
      count:
        jobsWithApplicationCounts.length,
      jobs: jobsWithApplicationCounts,
    });
  } catch (err) {
    console.error("Employer Jobs Error:", err);

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch employer jobs",
      error: err.message,
    });
  }
};

// =========================================
// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
// =========================================

exports.getJobById = async (req, res) => {
  try {
    const { userId } = req.query;

    const job = await Job.findById(
      req.params.id
    ).populate(
      "company",
      "name companyName companyLogo"
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    let applicationStatus = null;

    // Check application status
    if (userId) {
      const application =
        await Application.findOne({
          job: job._id,
          applicant: userId,
        }).select("status");

      if (application) {
        applicationStatus =
          application.status;
      }
    }

    res.json({
      success: true,

      job: {
        ...job.toObject(),
        applicationStatus,
      },
    });
  } catch (err) {
    console.error("Get Job Error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch job",
      error: err.message,
    });
  }
};

// =========================================
// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (Employer)
// =========================================

exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findById(
      req.params.id
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Ownership check
    if (
      job.company.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Not authorized to update this job",
      });
    }

    // Update fields
    Object.assign(job, req.body);

    // Normalize categories
    if (
      Object.prototype.hasOwnProperty.call(
        req.body,
        "category"
      ) ||
      Object.prototype.hasOwnProperty.call(
        req.body,
        "categories"
      )
    ) {
      job.category = normalizeCategories(
        req.body.category ||
          req.body.categories
      );
    }

    const updatedJob = await job.save();

    res.json({
      success: true,
      message: "Job updated successfully",
      job: updatedJob,
    });
  } catch (err) {
    console.error("Update Job Error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to update job",
      error: err.message,
    });
  }
};

// =========================================
// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Employer)
// =========================================

exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(
      req.params.id
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Ownership check
    if (
      job.company.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Not authorized to delete this job",
      });
    }

    await Application.deleteMany({
  job: job._id,
});

await SavedJob.deleteMany({
  job: job._id,
});

await job.deleteOne();

    res.json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (err) {
    console.error("Delete Job Error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to delete job",
      error: err.message,
    });
  }
};

// =========================================
// @desc    Toggle job open/close
// @route   PATCH /api/jobs/:id/toggle-close
// @access  Private (Employer)
// =========================================

exports.toggleCloseJob = async (req, res) => {
  try {
    const job = await Job.findById(
      req.params.id
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Ownership check
    if (
      job.company.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Not authorized to modify this job",
      });
    }

    // Toggle status
    job.isClosed = !job.isClosed;

    await job.save();

    res.json({
      success: true,
      message: job.isClosed
        ? "Job marked as closed"
        : "Job reopened successfully",
      isClosed: job.isClosed,
    });
  } catch (err) {
    console.error("Toggle Job Error:", err);

    res.status(500).json({
      success: false,
      message:
        "Failed to update job status",
      error: err.message,
    });
  }
};