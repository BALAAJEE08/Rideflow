import Payment from "../models/Payment.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listPayments = asyncHandler(async (req, res) => {
  const filter = req.user.role === "rider" ? { rider: req.user._id } : {};
  const payments = await Payment.find(filter).populate("ride").sort({ createdAt: -1 });
  res.json(payments);
});

export const mockPayment = asyncHandler(async (req, res) => {
  const payment = await Payment.findByIdAndUpdate(
    req.params.id,
    { status: "paid", method: req.body.method, transactionId: req.body.transactionId || `RF-${Date.now()}` },
    { new: true }
  );
  res.json(payment);
});
