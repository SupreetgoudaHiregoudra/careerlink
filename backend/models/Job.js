const mongoose = require("mongoose");

// =========================================
// Job Schema
// =========================================

const jobSchema = new mongoose.Schema(
  {
    // Job Title
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // Job Description
    description: {
      type: String,
      required: true,
      trim: true,
    },

    // Job Requirements
    requirements: {
      type: String,
      required: true,
      trim: true,
    },

    // Job Location
    location: {
      type: String,
      trim: true,
      default: "",
    },

    // Job Categories
    category: {
      type: [String],
      default: [],
    },

    // Employment Type
    type: {
      type: String,
      enum: [
        "Remote",
        "Full-Time",
        "Part-Time",
        "Internship",
        "Contract",
      ],
      required: true,
    },

    // Employer Reference
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Salary Range
    salaryMin: {
      type: Number,
      min: 0,
      default: 0,
    },

    salaryMax: {
      type: Number,
      min: 0,
      default: 0,
    },

    // Salary Type
    salaryType: {
      type: String,
      enum: [
        "Hourly",
        "Monthly",
        "Yearly",
      ],
      default: "Yearly",
    },

    // Currency
    currency: {
      type: String,
      enum: [
        "INR",
        "USD",
        "EUR",
        "GBP",
        "AED",
      ],
      default: "INR",
    },

    // Job Status
    isClosed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// =========================================
// Indexes
// =========================================

jobSchema.index({ title: "text" });
jobSchema.index({ location: 1 });
jobSchema.index({ category: 1 });
jobSchema.index({ type: 1 });
jobSchema.index({ company: 1 });
jobSchema.index({ isClosed: 1 });

// =========================================
// Export Model
// =========================================

module.exports = mongoose.model(
  "Job",
  jobSchema
);