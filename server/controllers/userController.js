import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listUsers = asyncHandler(async (req, res) => {
  const filter = req.query.role ? { role: req.query.role } : {};
  res.json(await User.find(filter).select("-password").sort({ createdAt: -1 }));
});

export const updateFavoriteLocations = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.user._id, { favoriteLocations: req.body.favoriteLocations || [] }, { new: true });
  res.json(user.favoriteLocations);
});
