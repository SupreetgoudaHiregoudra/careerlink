const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// =========================================
// User Schema
// =========================================

const userSchema = new mongoose.Schema(
  {
    // Profile Avatar
    avatar: {
      type: String,
      default: "",
      trim: true,
    },

    // User Role
    role: {
  type: String,
  enum: [
    "jobseeker",
    "employer",
    "admin",
  ],
  required: true,
},

    // Full Name
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // Email
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // Password
    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    // Resume URL
    resume: {
      type: String,
      default: "",
    },

    // =========================================
    // Employer Fields
    // =========================================

    companyName: {
      type: String,
      default: "",
      trim: true,
    },

    companyDescription: {
      type: String,
      default: "",
      trim: true,
    },

    companyLogo: {
      type: String,
      default: "",
    },

    // =========================================
    // Password Reset
    // =========================================

    resetPasswordToken: {
      type: String,
      default: "",
    },

    resetPasswordExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// =========================================
// Indexes
// =========================================

userSchema.index({ role: 1 });

// =========================================
// Encrypt Password Before Save
// =========================================

userSchema.pre(
  "save",
  async function () {
    // Skip if password not modified
    if (
      !this.isModified(
        "password"
      )
    ) {
      return;
    }

    // Generate salt
    const salt =
      await bcrypt.genSalt(10);

    // Hash password
    this.password =
      await bcrypt.hash(
        this.password,
        salt
      );
  }
);
// =========================================
// Match Password Method
// =========================================

userSchema.methods.matchPassword =
  async function (enteredPassword) {
    return await bcrypt.compare(
      enteredPassword,
      this.password
    );
  };

// =========================================
// Remove Password from JSON Response
// =========================================

userSchema.methods.toJSON = function () {
  const user = this.toObject();

  delete user.password;

  return user;
};

// =========================================
// Export Model
// =========================================

module.exports = mongoose.model(
  "User",
  userSchema
);