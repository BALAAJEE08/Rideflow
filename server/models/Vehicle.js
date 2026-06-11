import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["bike", "auto", "mini", "sedan", "suv"], unique: true, required: true },
    label: { type: String, required: true },
    baseFare: { type: Number, required: true, min: 0 },
    perKmFare: { type: Number, required: true, min: 0 },
    waitingCharges: { type: Number, default: 0, min: 0 },
    multiplier: { type: Number, default: 1, min: 0.1 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("Vehicle", vehicleSchema);
