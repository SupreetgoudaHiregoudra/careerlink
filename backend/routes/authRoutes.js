const express = require("express");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const {
  updateProfile,
} = require("../controllers/userController");

const {
  protect,
} = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// =========================================
// Local Upload Directory
// =========================================

const localUploadDir = path.join(
  __dirname,
  "..",
  "uploads"
);

// =========================================
// GridFS Bucket
// =========================================

const getUploadsBucket = () =>
  new mongoose.mongo.GridFSBucket(
    mongoose.connection.db,
    {
      bucketName: "uploads",
    }
  );

// =========================================
// Validate ObjectId
// =========================================

const isValidObjectId = (value) =>
  mongoose.Types.ObjectId.isValid(value);

// =========================================
// AUTH ROUTES
// =========================================

// Register
// POST /api/auth/register
router.post("/register", register);

// Login
// POST /api/auth/login
router.post("/login", login);

// Forgot Password
// POST /api/auth/forgot-password
router.post(
  "/forgot-password",
  forgotPassword
);

// Reset Password
// POST /api/auth/reset-password
router.post(
  "/reset-password",
  resetPassword
);

// =========================================
// USER ROUTES
// =========================================

// Get Logged-in User
// GET /api/auth/me
router.get(
  "/me",
  protect,
  getMe
);

// Update Profile
// PUT /api/auth/update-profile
router.put(
  "/update-profile",
  protect,
  updateProfile
);

// =========================================
// FILE UPLOAD
// =========================================

// Upload Image / Resume
// POST /api/auth/upload-image
router.post(
  "/upload-image",
  upload.single("image"),

  async (req, res) => {
    try {
      // No file uploaded
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      // Safe filename
      const safeOriginalName =
        req.file.originalname.replace(
          /\s+/g,
          "-"
        );

      const filename = `${Date.now()}-${safeOriginalName}`;

      // =========================================
      // Upload to GridFS
      // =========================================

      try {
        const bucket =
          getUploadsBucket();

        const uploadStream =
          bucket.openUploadStream(
            filename,
            {
              contentType:
                req.file.mimetype,

              metadata: {
                contentType:
                  req.file.mimetype,
              },
            }
          );

        await new Promise(
          (resolve, reject) => {
            uploadStream.on(
              "finish",
              resolve
            );

            uploadStream.on(
              "error",
              reject
            );

            uploadStream.end(
              req.file.buffer
            );
          }
        );

        const baseUrl =
          process.env
            .PUBLIC_BACKEND_URL ||
          `${req.protocol}://${req.get(
            "host"
          )}`;

        return res.status(200).json({
          success: true,
          message:
            "File uploaded successfully",

          imageUrl: `${baseUrl}/api/auth/file/${uploadStream.id}`,

          fileId:
            uploadStream.id.toString(),
        });
      } catch (error) {
        // =========================================
        // Local Storage Fallback
        // =========================================

        if (!process.env.VERCEL) {
          if (
            !fs.existsSync(
              localUploadDir
            )
          ) {
            fs.mkdirSync(
              localUploadDir,
              {
                recursive: true,
              }
            );
          }

          const filePath = path.join(
            localUploadDir,
            filename
          );

          fs.writeFileSync(
            filePath,
            req.file.buffer
          );

          const baseUrl =
            process.env
              .PUBLIC_BACKEND_URL ||
            `${req.protocol}://${req.get(
              "host"
            )}`;

          return res.status(200).json({
            success: true,
            message:
              "File uploaded successfully",

            imageUrl: `${baseUrl}/uploads/${filename}`,
          });
        }

        throw error;
      }
    } catch (error) {
      console.error(
        "Upload Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Upload failed",
      });
    }
  }
);

// =========================================
// GET FILE
// =========================================

// GET /api/auth/file/:id
router.get(
  "/file/:id",

  async (req, res) => {
    try {
      const { id } = req.params;

      // Validate ID
      if (!isValidObjectId(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid file id",
        });
      }

      const objectId =
        new mongoose.Types.ObjectId(
          id
        );

      const db =
        mongoose.connection.db;

      // Find file
      const fileDoc =
        await db
          .collection("uploads.files")
          .findOne({
            _id: objectId,
          });

      // File not found
      if (!fileDoc) {
        return res.status(404).json({
          success: false,
          message: "File not found",
        });
      }

      // Content type
      const contentType =
        fileDoc.contentType ||
        fileDoc.metadata
          ?.contentType ||
        "application/octet-stream";

      // Headers
      res.setHeader(
        "Content-Type",
        contentType
      );

      res.setHeader(
        "Cache-Control",
        "public, max-age=31536000, immutable"
      );

      // Download stream
      const bucket =
        getUploadsBucket();

      const stream =
        bucket.openDownloadStream(
          objectId
        );

      stream.on(
        "error",
        () => {
          if (!res.headersSent) {
            res.status(404).json({
              success: false,
              message:
                "File not found",
            });
          }
        }
      );

      stream.pipe(res);
    } catch (error) {
      console.error(
        "Get File Error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          error.message ||
          "Failed to fetch file",
      });
    }
  }
);

// =========================================
// Export Router
// =========================================

module.exports = router;