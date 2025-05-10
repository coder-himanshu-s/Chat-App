import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { authenticate } from "../middlewares/auth.middleware.js";
import path from "path";

const router = express.Router();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const extname = path.extname(file.originalname).toLowerCase();
    const isPDF = extname === ".pdf";

    return {
      folder: "chat-app-uploads",
      resource_type: isPDF ? "raw" : "auto",
      format: isPDF ? "pdf" : undefined,
      public_id: `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
      access_mode: "public", // Ensure the file is publicly accessible
    };
  },
});

const upload = multer({ storage });

router.post("/", authenticate, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    let url = req.file.path;
    const ext = path.extname(req.file.originalname).toLowerCase();

    // Force HTTPS
    if (url.startsWith("http://")) {
      url = url.replace("http://", "https://");
    }

    // Log the uploaded file details
    console.log("File uploaded successfully:", {
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      url: url,
    });

    return res.status(200).json({ url: url });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ message: "Upload failed", error: error.message });
  }
});

export default router;
