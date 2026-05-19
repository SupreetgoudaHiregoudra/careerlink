const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// =========================================
// Generate JWT Token
// =========================================

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: "60d",
    }
  );
};

// =========================================
// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
// =========================================

exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      avatar,
      role,
    } = req.body;

    // Validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Check existing user
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
      avatar,
    });

    // Response
    res.status(201).json({
      success: true,

      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || "",
        role: user.role,

        companyName: user.companyName || "",
        companyDescription:
          user.companyDescription || "",
        companyLogo: user.companyLogo || "",

        resume: user.resume || "",
      },

      token: generateToken(user._id),
    });
  } catch (err) {
    console.error("Register Error:", err);

    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: err.message,
    });
  }
};

// =========================================
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
// =========================================

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user
    const user = await User.findOne({ email });

    // Check credentials
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    res.json({
      success: true,

      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,

        avatar: user.avatar || "",

        companyName: user.companyName || "",
        companyDescription:
          user.companyDescription || "",
        companyLogo: user.companyLogo || "",

        resume: user.resume || "",
      },

      token: generateToken(user._id),
    });
  } catch (err) {
    console.error("Login Error:", err);

    res.status(500).json({
      success: false,
      message: "Login failed",
      error: err.message,
    });
  }
};

// =========================================
// @desc    Get logged-in user
// @route   GET /api/auth/me
// @access  Private
// =========================================

exports.getMe = async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user,
    });
  } catch (err) {
    console.error("Get Me Error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
      error: err.message,
    });
  }
};

// =========================================
// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
// =========================================

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Find user
    const user = await User.findOne({ email });

    // Security:
    // Don't reveal if user exists
    if (!user) {
      return res.json({
        success: true,
        message:
          "If that email exists, reset instructions were generated.",
      });
    }

    // Generate token
    const resetToken = crypto
      .randomBytes(32)
      .toString("hex");

    // Hash token
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Save token
    user.resetPasswordToken = hashedToken;

    // Token expiry: 15 mins
    user.resetPasswordExpires =
      Date.now() + 1000 * 60 * 15;

    await user.save();

    // Frontend URL
    const frontendBase =
      process.env.FRONTEND_URL ||
      "http://localhost:5173";

    const resetUrl =
      `${frontendBase}/reset-password?token=${resetToken}`;

    // TODO:
    // Send email in production

    res.json({
      success: true,
      message: "Reset link generated",
      resetToken,
      resetUrl,
    });
  } catch (err) {
    console.error("Forgot Password Error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to process forgot password",
      error: err.message,
    });
  }
};

// =========================================
// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
// =========================================

exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    // Validation
    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Token and new password are required",
      });
    }

    // Hash incoming token
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Find user
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: {
        $gt: Date.now(),
      },
    });

    // Invalid token
    if (!user) {
      return res.status(400).json({
        success: false,
        message:
          "Reset token is invalid or expired",
      });
    }

    // Update password
    user.password = password;

    // Remove reset fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({
      success: true,
      message: "Password reset successful",
    });
  } catch (err) {
    console.error("Reset Password Error:", err);

    res.status(500).json({
      success: false,
      message: "Password reset failed",
      error: err.message,
    });
  }
};