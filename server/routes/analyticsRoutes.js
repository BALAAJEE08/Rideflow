import express from "express";
import { adminAnalytics } from "../controllers/analyticsController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/admin", protect, authorize("admin"), adminAnalytics);

export default router;
