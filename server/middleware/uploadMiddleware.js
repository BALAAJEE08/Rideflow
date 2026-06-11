import fs from "fs";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";
import { ApiError } from "../utils/apiError.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9._-]/g, "-")}`)
});

export const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => file.mimetype.startsWith("image/") || file.mimetype === "application/pdf" ? cb(null, true) : cb(new ApiError(400, "Only images or PDFs are allowed.")),
  limits: { fileSize: 8 * 1024 * 1024 }
});
