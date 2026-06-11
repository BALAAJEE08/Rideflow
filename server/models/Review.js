import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    ride: { type: mongoose.Schema.Types.ObjectId, ref: "Ride", required: true, unique: true },
    rider: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: "Driver", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String, trim: true }
  },
  { timestamps: true }
);

export default mongoose.model("Review", reviewSchema);
