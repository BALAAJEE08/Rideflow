import express from "express";
import { listPayments, mockPayment } from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, listPayments);
router.put("/:id/pay", protect, mockPayment);

export default router;
