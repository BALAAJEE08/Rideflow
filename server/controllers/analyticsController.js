import Driver from "../models/Driver.js";
import Payment from "../models/Payment.js";
import Ride from "../models/Ride.js";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const adminAnalytics = asyncHandler(async (_req, res) => {
  const [users, drivers, rides, payments] = await Promise.all([User.find(), Driver.find(), Ride.find(), Payment.find()]);
  const revenue = payments.filter((p) => p.status === "paid").reduce((sum, p) => sum + p.amount, 0);
  const statusDistribution = Object.entries(rides.reduce((acc, ride) => ({ ...acc, [ride.status]: (acc[ride.status] || 0) + 1 }), {})).map(([name, value]) => ({ name, value }));
  const vehicleUsage = Object.entries(rides.reduce((acc, ride) => ({ ...acc, [ride.vehicleType]: (acc[ride.vehicleType] || 0) + 1 }), {})).map(([name, value]) => ({ name, value }));
  const dailyRides = rides.slice(-10).map((ride) => ({ day: ride.createdAt.toISOString().slice(5, 10), rides: 1 }));
  const revenueTrends = payments.slice(-10).map((p) => ({ day: p.createdAt.toISOString().slice(5, 10), revenue: p.amount }));
  const driverEarnings = drivers.slice(0, 10).map((d) => ({ driver: d.vehicleNumber, earnings: d.totalEarnings }));
  res.json({
    stats: {
      totalUsers: users.length,
      activeDrivers: drivers.filter((d) => d.isOnline).length,
      totalRides: rides.length,
      revenue,
      completedTrips: rides.filter((r) => r.status === "completed").length
    },
    dailyRides,
    revenueTrends,
    driverEarnings,
    statusDistribution,
    vehicleUsage
  });
});
