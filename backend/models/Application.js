const mongoose = require("mongoose");

// =========================================
// Application Schema
// =========================================

const applicationSchema = new mongoose.Schema(
  {
    // Related Job
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    // Applicant User
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Resume URL / File Link
    resume: {
      type: String,
      trim: true,
      default: "",
    },

    // Application Status
    status: {
      type: String,
      enum: [
        "Applied",
        "In Review",
        "Rejected",
        "Accepted",
      ],
      default: "Applied",
    },
  },
  {
    timestamps: true,
  }
);

// =========================================
// Prevent Duplicate Applications
// One user can apply only once per job
// =========================================

applicationSchema.index(
  { job: 1, applicant: 1 },
  { unique: true }
);

// =========================================
// Additional Indexes
// =========================================

applicationSchema.index({ applicant: 1 });
applicationSchema.index({ job: 1 });
applicationSchema.index({ status: 1 });

// =========================================
// Export Model
// =========================================

module.exports = mongoose.model(
  "Application",
  applicationSchema
);