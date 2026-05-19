const jwt = require("jsonwebtoken");
const User = require("../models/User");

// =========================================
// Middleware to protect routes
// =========================================

const protect = async (req, res, next) => {
  try {
    let token;

    // Check Authorization Header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith(
        "Bearer"
      )
    ) {
      // Extract token
      token =
        req.headers.authorization.split(
          " "
        )[1];
    }

    // No token
    if (!token) {
      return res.status(401).json({
        success: false,
        message:
          "Not authorized, no token provided",
      });
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Find user
    const user = await User.findById(
      decoded.id
    ).select("-password");

    // User not found
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // Attach user to request
    req.user = user;

    next();
  } catch (error) {
    console.error(
      "Authentication Error:",
      error
    );

    res.status(401).json({
      success: false,
      message: "Token verification failed",
      error: error.message,
    });
  }
};

module.exports = {
  protect,
};