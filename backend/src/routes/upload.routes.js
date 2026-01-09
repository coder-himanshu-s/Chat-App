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

// Validate Cloudinary configuration early to provide clearer errors
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.warn("Cloudinary credentials are not fully configured. Uploads will fail until CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET are set in environment.");
}
// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const extname = path.extname(file.originalname).toLowerCase();
    const isPDF = extname === ".pdf";
    const isImage = [".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(extname);

    return {
      folder: "chat-app-uploads",
      resource_type: isPDF ? "raw" : "auto",
      format: isPDF ? "pdf" : (isImage ? "auto" : undefined),
      public_id: `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
      access_mode: "public",
      // Optimize images during upload
      ...(isImage && {
        quality: "auto:good",
        fetch_format: "auto",
        transformation: [
          { width: 1920, height: 1920, crop: "limit" }, // Limit max size
          { quality: "auto:good" },
          { fetch_format: "auto" }
        ]
      })
    };
  },
});

const upload = multer({ storage });

router.post("/", authenticate, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    // multer-storage-cloudinary may expose the uploaded url under different keys
    // prefer `path`, then `secure_url`, then `url` as fallbacks
    let url = req.file?.path || req.file?.secure_url || req.file?.url || null;
    if (!url) {
      // As a last resort, if cloudinary returned public_id, build a basic URL
      if (req.file && req.file.public_id) {
        const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
        if (cloudName) {
          const format = req.file.format || path.extname(req.file.originalname).replace(".", "") || "";
          url = `https://res.cloudinary.com/${cloudName}/image/upload/${req.file.public_id}${format ? '.' + format : ''}`;
        }
      }
    }
    const ext = path.extname(req.file.originalname).toLowerCase();
    const isImage = [".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(ext);

    // Force HTTPS
    if (url.startsWith("http://")) {
      url = url.replace("http://", "https://");
    }

    // For images, add optimization parameters to URL
    if (isImage && url.includes("cloudinary.com")) {
      // Extract the base URL and add transformations
      const urlParts = url.split("/upload/");
      if (urlParts.length === 2) {
        url = `${urlParts[0]}/upload/q_auto:good,f_auto,w_auto,dpr_auto/${urlParts[1]}`;
      }
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
