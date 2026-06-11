import express from "express";
import { driverEarnings, listDrivers, nearbyDrivers, updateDriverStatus, upsertDriverProfile } from "../controllers/driverController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", protect, authorize("admin"), listDrivers);
router.get("/nearby", protect, authorize("rider", "admin"), nearbyDrivers);
router.get("/earnings", protect, authorize("driver"), driverEarnings);
router.put("/status", protect, authorize("driver"), updateDriverStatus);
router.put(
  "/profile",
  protect,
  authorize("driver"),
  upload.fields([{ name: "licenseDocument", maxCount: 1 }, { name: "vehicleDocument", maxCount: 1 }]),
  upsertDriverProfile
);

export default router;
