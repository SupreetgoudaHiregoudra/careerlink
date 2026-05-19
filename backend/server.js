require("dotenv").config();

// =========================================
// Imports
// =========================================

const connectDB = require("./config/db");
const app = require("./app");

// CONTACT ROUTES
const contactRoutes = require("./routes/contactRoutes");

// =========================================
// Middleware Routes
// =========================================

// CONTACT API
app.use("/api/contact", contactRoutes);

// =========================================
// Config
// =========================================

const PORT = process.env.PORT || 5000;

// =========================================
// Start Server
// =========================================

const startServer = async () => {
  try {
    // Connect MongoDB
    await connectDB();

    // Start Express Server
    app.listen(PORT, () => {
      console.log(
        `Server running on port ${PORT}`
      );

      console.log(
        `Environment: ${process.env.NODE_ENV}`
      );

      console.log(
        `Backend URL: http://localhost:${PORT}`
      );

      console.log(
        `Contact API: http://localhost:${PORT}/api/contact/send`
      );
    });

  } catch (err) {

    console.error(
      "Server Startup Error:",
      err.message
    );

    process.exit(1);
  }
};

// =========================================
// Run Server
// =========================================

startServer();