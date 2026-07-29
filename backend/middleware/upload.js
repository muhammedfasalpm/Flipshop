import multer from "multer";
import path from "path";
import fs from "fs";

// Create uploads folder if it doesn't exist
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(
      null,
      `${Date.now()}${path.extname(
        file.originalname
      )}`
    );
  },
});

// File filter
const checkFileType = (file, cb) => {
  const filetypes =
    /jpeg|jpg|png|webp|pdf|doc|docx/;

  const extname = filetypes.test(
    path.extname(
      file.originalname
    ).toLowerCase()
  );

  const mimetypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (
    extname &&
    mimetypes.includes(file.mimetype)
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only JPG, PNG, WEBP, PDF, DOC and DOCX files are allowed"
      )
    );
  }
};

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },

  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

export default upload;