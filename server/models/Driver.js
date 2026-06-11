import mongoose from "mongoose";

const driverSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    licenseNumber: { type: String, required: true, trim: true },
    licenseDocument: String,
    vehicleDocument: String,
    vehicleType: { type: String, enum: ["bike", "auto", "mini", "sedan", "suv"], required: true },
    vehicleNumber: { type: String, required: true, trim: true },
    vehicleModel: { type: String, required: true, trim: true },
    isOnline: { type: Boolean, default: false, index: true },
    isAvailable: { type: Boolean, default: true, index: true },
    currentLocation: {
      lat: Number,
      lng: Number,
      address: String,
      updatedAt: Date
    },
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    status: { type: String, enum: ["pending", "approved", "blocked"], default: "pending" }
  },
  { timestamps: true }
);

export default mongoose.model("Driver", driverSchema);
