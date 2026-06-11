import mongoose from "mongoose";

const pointSchema = new mongoose.Schema(
  {
    address: { type: String, required: true },
    lat: Number,
    lng: Number
  },
  { _id: false }
);

const rideSchema = new mongoose.Schema(
  {
    rider: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: "Driver", index: true },
    vehicleType: { type: String, enum: ["bike", "auto", "mini", "sedan", "suv"], required: true },
    pickup: pointSchema,
    drop: pointSchema,
    distanceKm: { type: Number, required: true, min: 0 },
    waitingMinutes: { type: Number, default: 0, min: 0 },
    estimatedFare: { type: Number, required: true, min: 0 },
    finalFare: { type: Number, min: 0 },
    status: {
      type: String,
      enum: ["requested", "driver-assigned", "driver-arriving", "started", "completed", "cancelled"],
      default: "requested",
      index: true
    },
    cancelledBy: { type: String, enum: ["rider", "driver", "admin"] },
    timeline: [
      {
        status: String,
        note: String,
        at: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Ride", rideSchema);
