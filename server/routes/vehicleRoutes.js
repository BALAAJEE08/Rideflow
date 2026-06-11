import express from "express";
import { createVehicle, listVehicles, updateVehicle } from "../controllers/vehicleController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";

const router = express.Router();

router.get("/", protect, listVehicles);
router.post("/", protect, authorize("admin"), validate({ type: { required: true }, label: { required: true }, baseFare: { required: true, type: "number" }, perKmFare: { required: true, type: "number" } }), createVehicle);
router.put("/:id", protect, authorize("admin"), updateVehicle);

export default router;
