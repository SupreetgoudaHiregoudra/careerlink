const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const User = require("../models/User");

// =========================================
// Uploads Directory
// =========================================

const uploadsDir = process.env.VERCEL
  ? path.join("/tmp", "uploads")
  : path.join(__dirname, "..", "uploads");

// =========================================
// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
// =========================================

exports.updateProfile = async (req, res) => {
  try {
    const {
      name,
      avatar,
      companyName,
      companyDescription,
      companyLogo,
      resume,
    } = req.body;

    // Find user
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update basic profile
   // Update basic profile
if (name !== undefined) {
  user.name = name;
}

if (avatar !== undefined) {
  user.avatar = avatar;
}

if (resume !== undefined) {
  user.resume = resume;
}

// Employer-only fields
if (user.role === "employer") {

  if (companyName !== undefined) {
    user.companyName = companyName;
  }

  if (
    companyDescription !== undefined
  ) {
    user.companyDescription =
      companyDescription;
  }

  if (companyLogo !== undefined) {
    user.companyLogo = companyLogo;
  }
}

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",

      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || "",
        role: user.role,

        companyName:
          user.companyName || "",

        companyDescription:
          user.companyDescription || "",

        companyLogo:
          user.companyLogo || "",

        resume: user.resume || "",
      },
    });
  } catch (err) {
    console.error("Update Profile Error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: err.message,
    });
  }
};

// =========================================
// @desc    Delete resume
// @route   DELETE /api/users/resume
// @access  Private (Jobseeker)
// =========================================

exports.deleteResume = async (req, res) => {
  try {
    const { resumeUrl } = req.body;

    // Find user
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Role check
    if (user.role !== "jobseeker") {
      return res.status(403).json({
        success: false,
        message:
          "Only jobseekers can delete resumes",
      });
    }

    // =========================================
    // Extract GridFS File ID
    // =========================================

    const extractFileId = (value) => {
      if (
        !value ||
        typeof value !== "string"
      ) {
        return null;
      }

      const trimmed = value.trim();

      if (!trimmed) {
        return null;
      }

      // Direct ObjectId
      if (
        mongoose.Types.ObjectId.isValid(
          trimmed
        )
      ) {
        return trimmed;
      }

      try {
        const parsed = new URL(trimmed);

        const parts = parsed.pathname
          .split("/")
          .filter(Boolean);

        const maybeId =
          parts[parts.length - 1];

        return mongoose.Types.ObjectId.isValid(
          maybeId
        )
          ? maybeId
          : null;
      } catch {
        const parts = trimmed
          .split("/")
          .filter(Boolean);

        const maybeId =
          parts[parts.length - 1];

        return mongoose.Types.ObjectId.isValid(
          maybeId
        )
          ? maybeId
          : null;
      }
    };

    // =========================================
    // Delete GridFS File
    // =========================================

    const fileId = extractFileId(
      resumeUrl
    );

    if (fileId) {
      try {
        const bucket =
          new mongoose.mongo.GridFSBucket(
            mongoose.connection.db,
            {
              bucketName: "uploads",
            }
          );

        await bucket.delete(
          new mongoose.Types.ObjectId(
            fileId
          )
        );
      } catch {
        // Ignore missing files
      }
    }

    // =========================================
    // Delete Legacy Local File
    // =========================================

    if (
      typeof resumeUrl === "string" &&
      resumeUrl.includes("/uploads/")
    ) {
      const fileName =
        resumeUrl.split("/").pop();

      const filePath = path.join(
        uploadsDir,
        fileName
      );

      if (
        fileName &&
        fs.existsSync(filePath)
      ) {
        fs.unlinkSync(filePath);
      }
    }

    // Remove resume from user profile
    user.resume = "";

    await user.save();

    res.json({
      success: true,
      message:
        "Resume deleted successfully",
    });
  } catch (err) {
    console.error("Delete Resume Error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to delete resume",
      error: err.message,
    });
  }
};

// =========================================
// @desc    Get public user profile
// @route   GET /api/users/:id
// @access  Public
// =========================================

exports.getPublicProfile = async (
  req,
  res
) => {
  try {
    const user = await User.findById(
      req.params.id
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (err) {
    console.error(
      "Get Public Profile Error:",
      err
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch user profile",
      error: err.message,
    });
  }
};