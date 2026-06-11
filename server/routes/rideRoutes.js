import express from "express";
import { acceptRide, cancelRide, createRide, estimateFare, listRides, updateRideStatus } from "../controllers/rideController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";

const router = express.Router();

router.post("/estimate", protect, validate({ vehicleType: { required: true }, distanceKm: { required: true, type: "number" } }), estimateFare);
router.route("/").get(protect, listRides).post(protect, authorize("rider"), validate({ vehicleType: { required: true }, distanceKm: { required: true, type: "number" } }), createRide);
router.put("/:id/accept", protect, authorize("driver"), acceptRide);
router.put("/:id/status", protect, authorize("driver", "admin"), validate({ status: { required: true } }), updateRideStatus);
router.put("/:id/cancel", protect, cancelRide);

export default router;
