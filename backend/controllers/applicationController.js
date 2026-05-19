const Application = require("../models/Application");
const Job = require("../models/Job");

// =========================================
// @desc    Apply to a job
// @route   POST /api/applications/:jobId
// @access  Private (Jobseeker)
// =========================================

exports.applyToJob = async (req, res) => {
  try {
    // Role check
    if (req.user.role !== "jobseeker") {
      return res.status(403).json({
        success: false,
        message: "Only job seekers can apply",
      });
    }

    // Check job exists
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Prevent applying to closed jobs
    if (job.isClosed) {
      return res.status(400).json({
        success: false,
        message: "This job is closed",
      });
    }

    // Prevent duplicate application
    const existing = await Application.findOne({
      job: req.params.jobId,
      applicant: req.user._id,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Already applied to this job",
      });
    }

    // Create application
    const application = await Application.create({
      job: req.params.jobId,
      applicant: req.user._id,
      resume: req.user.resume || "",
      status: "Applied",
    });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application,
    });
  } catch (err) {
    console.error("Apply Job Error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to apply for job",
      error: err.message,
    });
  }
};

// =========================================
// @desc    Get logged-in user's applications
// @route   GET /api/applications/me
// @access  Private
// =========================================
// =========================================
// @desc    Get logged-in user's applications
// @route   GET /api/applications/my
// @access  Private
// =========================================

exports.getMyApplications = async (
  req,
  res
) => {
  try {
    const applications =
      await Application.find({
        applicant: req.user._id,
      })
        .populate({
          path: "job",
          populate: {
            path: "company",
            select:
              "companyName companyLogo",
          },
        })
        .sort({
          createdAt: -1,
        });

    // REMOVE DELETED JOBS
    const validApplications =
      applications.filter(
        (application) =>
          application.job
      );

    res.status(200).json({
      success: true,
      count:
        validApplications.length,
      applications:
        validApplications,
    });
  } catch (err) {
    console.error(
      "Get My Applications Error:",
      err
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch applications",
      error: err.message,
    });
  }
};

// =========================================
// @desc    Get all applicants for a job
// @route   GET /api/applications/job/:jobId
// @access  Private (Employer)
// =========================================

exports.getApplicantsForJob = async (
  req,
  res
) => {
  try {
    const job =
      await Job.findById(
        req.params.jobId
      );

    // Check job exists
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Verify employer owns job
    if (
      job.company.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Not authorized to view applicants",
      });
    }

    // Get applications
    const applications =
      await Application.find({
        job: req.params.jobId,
      })
        .populate(
          "applicant",
          "name email avatar resume"
        )
        .populate(
          "job",
          "title location type"
        )
        .sort({
          createdAt: -1,
        });

    res.status(200).json({
      success: true,
      count:
        applications.length,
      applications,
    });
  } catch (err) {
    console.error(
      "Get Applicants Error:",
      err
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch applicants",
      error: err.message,
    });
  }
};

// =========================================
// @desc    Get application by ID
// @route   GET /api/applications/:id
// @access  Private
// =========================================

exports.getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate("job")
      .populate("applicant", "name email avatar resume");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Check ownership
    const isApplicant =
      application.applicant._id.toString() === req.user._id.toString();

    const isEmployer =
      application.job.company.toString() === req.user._id.toString();

    if (!isApplicant && !isEmployer) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this application",
      });
    }

    res.json({
      success: true,
      application,
    });
  } catch (err) {
    console.error("Get Application Error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch application",
      error: err.message,
    });
  }
};

// =========================================
// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Employer)
// =========================================

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Applied",
      "In Review",
      "Accepted",
      "Rejected",
    ];

    // Validate status
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const application = await Application.findById(
      req.params.id
    ).populate("job");

    // Check application exists
    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Verify employer ownership
    if (
      !application.job ||
      application.job.company.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this application",
      });
    }

    // Update status
    application.status = status;

    await application.save();

    res.json({
      success: true,
      message: "Application status updated successfully",
      status,
    });
  } catch (err) {
    console.error("Update Status Error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to update application status",
      error: err.message,
    });
  }
};