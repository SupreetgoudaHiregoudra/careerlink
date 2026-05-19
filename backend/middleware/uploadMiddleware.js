const multer = require("multer");

// =========================================
// Multer Memory Storage
// =========================================

const storage = multer.memoryStorage();

// =========================================
// Allowed File Types
// =========================================

const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/webp",
  "application/pdf",
];

// =========================================
// File Filter
// =========================================

const fileFilter = (req, file, cb) => {
  try {
    // Validate mime type
    if (allowedTypes.includes(file.mimetype)) {
      return cb(null, true);
    }

    return cb(
      new Error(
        "Only JPEG, JPG, PNG, WEBP, and PDF files are allowed"
      ),
      false
    );
  } catch (err) {
    return cb(err, false);
  }
};

// =========================================
// Multer Upload Config
// =========================================

const upload = multer({
  storage,

  fileFilter,

  limits: {
    // 10MB
    fileSize: 10 * 1024 * 1024,
  },
});

// =========================================
// Export
// =========================================

module.exports = upload;