import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";
import Vehicle from "../models/Vehicle.js";

dotenv.config();
await connectDB();

await Vehicle.deleteMany({});
await Vehicle.insertMany([
  { type: "bike", label: "Bike", baseFare: 25, perKmFare: 8, waitingCharges: 1, multiplier: 0.8 },
  { type: "auto", label: "Auto", baseFare: 35, perKmFare: 12, waitingCharges: 1.5, multiplier: 1 },
  { type: "mini", label: "Mini", baseFare: 60, perKmFare: 16, waitingCharges: 2, multiplier: 1.1 },
  { type: "sedan", label: "Sedan", baseFare: 80, perKmFare: 20, waitingCharges: 2.5, multiplier: 1.25 },
  { type: "suv", label: "SUV", baseFare: 110, perKmFare: 26, waitingCharges: 3, multiplier: 1.5 }
]);

if (!(await User.findOne({ email: "admin@rideflow.com" }))) {
  await User.create({ name: "RideFlow Admin", email: "admin@rideflow.com", phone: "9000000000", password: "Admin@12345", role: "admin" });
}

console.log("RideFlow seed data inserted.");
process.exit(0);
