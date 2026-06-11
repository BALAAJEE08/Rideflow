import Driver from "../models/Driver.js";
import Payment from "../models/Payment.js";
import Ride from "../models/Ride.js";
import { calculateFare } from "../services/fareService.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const rideFilter = (req) => {
  if (req.user.role === "rider") return { rider: req.user._id };
  return {};
};

export const estimateFare = asyncHandler(async (req, res) => {
  const estimatedFare = await calculateFare(req.body);
  res.json({ estimatedFare });
});

export const createRide = asyncHandler(async (req, res) => {
  const estimatedFare = await calculateFare(req.body);
  const ride = await Ride.create({
    ...req.body,
    rider: req.user._id,
    estimatedFare,
    timeline: [{ status: "requested", note: "Ride request created" }]
  });
  req.app.get("io").to("driver").emit("ride:requested", ride);
  res.status(201).json(ride);
});

export const listRides = asyncHandler(async (req, res) => {
  let filter = rideFilter(req);
  if (req.user.role === "driver") {
    const driver = await Driver.findOne({ user: req.user._id });
    filter = { driver: driver?._id };
  }
  if (req.query.status) filter.status = req.query.status;
  const rides = await Ride.find(filter).populate("rider", "name phone").populate({ path: "driver", populate: { path: "user", select: "name phone profilePhoto" } }).sort({ createdAt: -1 });
  res.json(rides);
});

export const acceptRide = asyncHandler(async (req, res) => {
  const driver = await Driver.findOne({ user: req.user._id });
  if (!driver || !driver.isOnline) throw new ApiError(400, "Driver must be online to accept rides.");
  const ride = await Ride.findOneAndUpdate(
    { _id: req.params.id, status: "requested" },
    { driver: driver._id, status: "driver-assigned", $push: { timeline: { status: "driver-assigned", note: "Driver accepted ride" } } },
    { new: true }
  ).populate("rider", "name phone");
  if (!ride) throw new ApiError(404, "Ride is not available.");
  driver.isAvailable = false;
  await driver.save();
  req.app.get("io").emit("ride:accepted", ride);
  res.json(ride);
});

export const updateRideStatus = asyncHandler(async (req, res) => {
  const ride = await Ride.findById(req.params.id);
  if (!ride) throw new ApiError(404, "Ride not found.");
  ride.status = req.body.status;
  ride.timeline.push({ status: req.body.status, note: req.body.note || "Ride status updated" });
  if (req.body.status === "completed") {
    ride.finalFare = await calculateFare({ vehicleType: ride.vehicleType, distanceKm: ride.distanceKm, waitingMinutes: ride.waitingMinutes });
    if (ride.driver) {
      await Driver.findByIdAndUpdate(ride.driver, { isAvailable: true, $inc: { totalEarnings: ride.finalFare } });
    }
    await Payment.create({
      ride: ride._id,
      rider: ride.rider,
      driver: ride.driver,
      amount: ride.finalFare,
      method: req.body.paymentMethod || "cash",
      status: req.body.paymentMethod === "cash" ? "pending" : "paid",
      transactionId: `RF-${Date.now()}`
    });
  }
  await ride.save();
  req.app.get("io").emit("ride:status", ride);
  res.json(ride);
});

export const cancelRide = asyncHandler(async (req, res) => {
  const ride = await Ride.findOneAndUpdate(
    { _id: req.params.id, ...rideFilter(req), status: { $nin: ["completed", "cancelled"] } },
    { status: "cancelled", cancelledBy: req.user.role, $push: { timeline: { status: "cancelled", note: "Ride cancelled" } } },
    { new: true }
  );
  if (!ride) throw new ApiError(404, "Ride cannot be cancelled.");
  if (ride.driver) await Driver.findByIdAndUpdate(ride.driver, { isAvailable: true });
  req.app.get("io").emit("ride:cancelled", ride);
  res.json(ride);
});
