import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

// resolve __dirname (ESM style)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Storage setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

router.post("/", upload.single("file"), (req, res) => {
  const fileUrl = `${process.env.BASE_URL || "http://localhost:3000"}/uploads/${req.file.filename}`;
  res.status(200).json({ url: fileUrl });
});

export default router;
