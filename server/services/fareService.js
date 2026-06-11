import Vehicle from "../models/Vehicle.js";
import { ApiError } from "../utils/apiError.js";

const defaults = {
  bike: { baseFare: 25, perKmFare: 8, waitingCharges: 1, multiplier: 0.8 },
  auto: { baseFare: 35, perKmFare: 12, waitingCharges: 1.5, multiplier: 1 },
  mini: { baseFare: 60, perKmFare: 16, waitingCharges: 2, multiplier: 1.1 },
  sedan: { baseFare: 80, perKmFare: 20, waitingCharges: 2.5, multiplier: 1.25 },
  suv: { baseFare: 110, perKmFare: 26, waitingCharges: 3, multiplier: 1.5 }
};

export const calculateFare = async ({ vehicleType, distanceKm, waitingMinutes = 0 }) => {
  const vehicle = await Vehicle.findOne({ type: vehicleType, isActive: true });
  const pricing = vehicle || defaults[vehicleType];
  if (!pricing) throw new ApiError(400, "Invalid vehicle type.");
  const fare =
    (pricing.baseFare + Number(distanceKm) * pricing.perKmFare + Number(waitingMinutes) * pricing.waitingCharges) *
    pricing.multiplier;
  return Math.max(Math.round(fare), pricing.baseFare);
};
