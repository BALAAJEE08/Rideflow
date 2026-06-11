import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Driver from "../models/Driver.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });
const userPayload = (user) => ({ id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role, profilePhoto: user.profilePhoto, favoriteLocations: user.favoriteLocations });

export const register = asyncHandler(async (req, res) => {
  const { name, email, phone, password, role = "rider", driver = {} } = req.body;
  if (await User.findOne({ email })) throw new ApiError(409, "Email is already registered.");
  const user = await User.create({ name, email, phone, password, role });
  if (role === "driver") {
    await Driver.create({
      user: user._id,
      licenseNumber: driver.licenseNumber || "PENDING",
      vehicleType: driver.vehicleType || "mini",
      vehicleNumber: driver.vehicleNumber || "PENDING",
      vehicleModel: driver.vehicleModel || "PENDING"
    });
  }
  res.status(201).json({ token: signToken(user._id), user: userPayload(user) });
});

export const login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).select("+password");
  if (!user || !(await user.comparePassword(req.body.password))) throw new ApiError(401, "Invalid email or password.");
  res.json({ token: signToken(user._id), user: userPayload(user) });
});

export const me = asyncHandler(async (req, res) => {
  const driver = req.user.role === "driver" ? await Driver.findOne({ user: req.user._id }) : null;
  res.json({ user: userPayload(req.user), driver });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true });
  res.json({ user: userPayload(user) });
});
