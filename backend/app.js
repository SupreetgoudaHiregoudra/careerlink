const express = require("express");
const cors = require("cors");
const path = require("path");

// =========================================
// Routes
// =========================================
const contactRoutes = require("./routes/contactRoutes");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const savedJobsRoutes = require("./routes/savedJobRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

// =========================================
// DNS Fix
// =========================================

require("node:dns/promises").setServers([
  "1.1.1.1",
  "8.8.8.8",
]);

// =========================================
// Express App
// =========================================

const app = express();

// =========================================
// Uploads Directory
// =========================================

const uploadsDir = process.env.VERCEL
  ? path.join("/tmp", "uploads")
  : path.join(__dirname, "uploads");

// =========================================
// Middlewares
// =========================================

// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",

    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "PATCH",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

// JSON parser
app.use(express.json());
app.use(cors());

app.use("/api/contact", contactRoutes);
// Form parser
app.use(
  express.urlencoded({
    extended: true,
  })
);

// =========================================
// API Routes
// =========================================

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/jobs", jobRoutes);

app.use(
  "/api/applications",
  applicationRoutes
);

app.use(
  "/api/saved-jobs",
  savedJobsRoutes
);

app.use(
  "/api/analytics",
  analyticsRoutes
);

app.use(
  "/api/admin",
  adminRoutes
);
// =========================================
// Static Uploads
// =========================================

app.use(
  "/uploads",
  express.static(uploadsDir)
);

// =========================================
// Health Check Route
// =========================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message:
      "CareerLink Backend API Running",
  });
});

// =========================================
// 404 Handler
// =========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// =========================================
// Global Error Handler
// =========================================

app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  res.status(500).json({
    success: false,
    message:
      err.message ||
      "Internal Server Error",
  });
});

// =========================================
// Export App
// =========================================

module.exports = app;