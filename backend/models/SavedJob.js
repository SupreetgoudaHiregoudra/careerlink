const mongoose = require("mongoose");

// =========================================
// Saved Job Schema
// =========================================

const savedJobSchema = new mongoose.Schema(
  {
    // Jobseeker Reference
    jobseeker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Saved Job Reference
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// =========================================
// Prevent Duplicate Saved Jobs
// One user can save a job only once
// =========================================

savedJobSchema.index(
  { jobseeker: 1, job: 1 },
  { unique: true }
);

// =========================================
// Additional Indexes
// =========================================

savedJobSchema.index({ jobseeker: 1 });
savedJobSchema.index({ job: 1 });

// =========================================
// Export Model
// =========================================

module.exports = mongoose.model(
  "SavedJob",
  savedJobSchema
);