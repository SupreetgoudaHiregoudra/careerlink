const Job = require("../models/Job");
const Application = require("../models/Application");
const User = require("../models/User");

const getTrend = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0;

  return Math.round(((current - previous) / previous) * 100);
};

exports.getEmployerAnalytics = async (req, res) => {
  try {
    // Check role
    if (req.user.role !== "employer") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const companyId = req.user._id;

    // Dates
    const now = new Date();

    const last7Days = new Date();
    last7Days.setDate(now.getDate() - 7);

    const prev7Days = new Date();
    prev7Days.setDate(now.getDate() - 14);

    // Get employer jobs
    const jobs = await Job.find({ company: companyId })
      .select("_id")
      .lean();

    const jobIds = jobs.map((job) => job._id);

    // If no jobs exist
    if (jobIds.length === 0) {
      return res.json({
        success: true,
        counts: {
          totalActiveJobs: 0,
          totalApplications: 0,
          totalHired: 0,
          trends: {
            activeJobs: 0,
            totalApplicants: 0,
            totalHired: 0,
          },
        },
        data: {
          recentJobs: [],
          recentApplications: [],
        },
      });
    }

    // =========================
    // COUNTS
    // =========================

    const [
      totalActiveJobs,
      totalApplications,
      totalHired,
      activeJobsLast7,
      activeJobsPrev7,
      applicationsLast7,
      applicationsPrev7,
      hiredLast7,
      hiredPrev7,
    ] = await Promise.all([
      // Total active jobs
      Job.countDocuments({
        company: companyId,
        isClosed: false,
      }),

      // Total applications
      Application.countDocuments({
        job: { $in: jobIds },
      }),

      // Total hired
      Application.countDocuments({
        job: { $in: jobIds },
        status: "Accepted",
      }),

      // Active jobs last 7 days
      Job.countDocuments({
        company: companyId,
        createdAt: {
          $gte: last7Days,
          $lt: now,
        },
      }),

      // Active jobs previous 7 days
      Job.countDocuments({
        company: companyId,
        createdAt: {
          $gte: prev7Days,
          $lt: last7Days,
        },
      }),

      // Applications last 7 days
      Application.countDocuments({
        job: { $in: jobIds },
        createdAt: {
          $gte: last7Days,
          $lt: now,
        },
      }),

      // Applications previous 7 days
      Application.countDocuments({
        job: { $in: jobIds },
        createdAt: {
          $gte: prev7Days,
          $lt: last7Days,
        },
      }),

      // Hired last 7 days
      Application.countDocuments({
        job: { $in: jobIds },
        status: "Accepted",
        createdAt: {
          $gte: last7Days,
          $lt: now,
        },
      }),

      // Hired previous 7 days
      Application.countDocuments({
        job: { $in: jobIds },
        status: "Accepted",
        createdAt: {
          $gte: prev7Days,
          $lt: last7Days,
        },
      }),
    ]);

    // =========================
    // TRENDS
    // =========================

    const activeJobTrend = getTrend(
      activeJobsLast7,
      activeJobsPrev7
    );

    const applicantTrend = getTrend(
      applicationsLast7,
      applicationsPrev7
    );

    const hiredTrend = getTrend(
      hiredLast7,
      hiredPrev7
    );

    // =========================
    // RECENT DATA
    // =========================

    const [recentJobs, recentApplications] = await Promise.all([
      Job.find({ company: companyId })
        .sort({ createdAt: -1 })
        .limit(5)
        .select("title location type createdAt isClosed"),

      Application.find({
        job: { $in: jobIds },
      })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("applicant", "name email avatar")
        .populate("job", "title"),
    ]);

    // =========================
    // RESPONSE
    // =========================

    res.json({
      success: true,
      counts: {
        totalActiveJobs,
        totalApplications,
        totalHired,

        trends: {
          activeJobs: activeJobTrend,
          totalApplicants: applicantTrend,
          totalHired: hiredTrend,
        },
      },

      data: {
        recentJobs,
        recentApplications,
      },
    });
  } catch (err) {
    console.error("Analytics Error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics",
      error: err.message,
    });
  }
};

exports.getPublicStats = async (_req, res) => {
  try {
    const [
      activeUsers,
      companies,
      jobsPosted,
      successfulHires,
    ] = await Promise.all([
      User.countDocuments({}),
      User.countDocuments({ role: "employer" }),
      Job.countDocuments({}),
      Application.countDocuments({
        status: "Accepted",
      }),
    ]);

    res.json({
      success: true,
      activeUsers,
      companies,
      jobsPosted,
      successfulHires,
    });
  } catch (err) {
    console.error("Public Stats Error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch public stats",
      error: err.message,
    });
  }
};