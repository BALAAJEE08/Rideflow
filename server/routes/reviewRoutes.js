import express from "express";
import { createReview, listReviews } from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";

const router = express.Router();

router.get("/", protect, listReviews);
router.post("/", protect, authorize("rider"), validate({ ride: { required: true }, rating: { required: true, type: "number" } }), createReview);

export default router;
