import Driver from "../models/Driver.js";
import Ride from "../models/Ride.js";
import { uploadToCloudinary } from "../services/cloudinaryService.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const upsertDriverProfile = asyncHandler(async (req, res) => {
  const updates = { ...req.body };
  if (req.files?.licenseDocument?.[0]) {
    const uploaded = await uploadToCloudinary(req.files.licenseDocument[0].path, "rideflow/licenses");
    updates.licenseDocument = uploaded?.secure_url || `/uploads/${req.files.licenseDocument[0].filename}`;
  }
  if (req.files?.vehicleDocument?.[0]) {
    const uploaded = await uploadToCloudinary(req.files.vehicleDocument[0].path, "rideflow/vehicles");
    updates.vehicleDocument = uploaded?.secure_url || `/uploads/${req.files.vehicleDocument[0].filename}`;
  }
  const driver = await Driver.findOneAndUpdate({ user: req.user._id }, updates, { new: true, upsert: true, runValidators: true });
  res.json(driver);
});

export const listDrivers = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.online === "true") filter.isOnline = true;
  if (req.query.vehicleType) filter.vehicleType = req.query.vehicleType;
  const drivers = await Driver.find(filter).populate("user", "name email phone profilePhoto").sort({ isOnline: -1, averageRating: -1 });
  res.json(drivers);
});

export const nearbyDrivers = asyncHandler(async (req, res) => {
  const drivers = await Driver.find({ isOnline: true, isAvailable: true, status: { $ne: "blocked" } })
    .populate("user", "name phone profilePhoto")
    .limit(20);
  res.json(drivers);
});

export const updateDriverStatus = asyncHandler(async (req, res) => {
  const driver = await Driver.findOneAndUpdate(
    { user: req.user._id },
    { isOnline: req.body.isOnline, currentLocation: req.body.currentLocation },
    { new: true, runValidators: true }
  );
  if (!driver) throw new ApiError(404, "Driver profile not found.");
  req.app.get("io").emit("driver:availability", driver);
  res.json(driver);
});

export const driverEarnings = asyncHandler(async (req, res) => {
  const driver = await Driver.findOne({ user: req.user._id });
  if (!driver) throw new ApiError(404, "Driver profile not found.");
  const rides = await Ride.find({ driver: driver._id, status: "completed" }).sort({ updatedAt: -1 });
  res.json({ totalEarnings: driver.totalEarnings, completedTrips: rides.length, rides });
});
