import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    ride: { type: mongoose.Schema.Types.ObjectId, ref: "Ride", required: true, index: true },
    rider: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: "Driver" },
    amount: { type: Number, required: true, min: 0 },
    method: { type: String, enum: ["upi", "credit-card", "debit-card", "cash"], required: true },
    status: { type: String, enum: ["pending", "paid", "failed", "refunded"], default: "pending" },
    transactionId: { type: String, unique: true, sparse: true }
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
