import Vehicle from "../models/Vehicle.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.create(req.body);
  res.status(201).json(vehicle);
});

export const listVehicles = asyncHandler(async (_req, res) => {
  res.json(await Vehicle.find().sort({ baseFare: 1 }));
});

export const updateVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!vehicle) throw new ApiError(404, "Vehicle pricing not found.");
  res.json(vehicle);
});
