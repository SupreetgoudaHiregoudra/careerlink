const mongoose = require("mongoose");

// =========================================
// Analytics Schema
// =========================================

const analyticsSchema = new mongoose.Schema(
  {
    // Employer reference
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // Total jobs posted
    totalJobsPosted: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Total applications received
    totalApplicationsReceived: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Total hired candidates
    totalHired: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// =========================================
// Indexes
// =========================================

analyticsSchema.index({ employer: 1 });

// =========================================
// Export Model
// =========================================

module.exports = mongoose.model(
  "Analytics",
  analyticsSchema
);