import Driver from "../models/Driver.js";
import Review from "../models/Review.js";
import Ride from "../models/Ride.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createReview = asyncHandler(async (req, res) => {
  const ride = await Ride.findOne({ _id: req.body.ride, rider: req.user._id, status: "completed" });
  if (!ride || !ride.driver) throw new ApiError(400, "Only completed rides can be reviewed.");
  const review = await Review.create({ ride: ride._id, rider: req.user._id, driver: ride.driver, rating: req.body.rating, review: req.body.review });
  const stats = await Review.aggregate([{ $match: { driver: ride.driver } }, { $group: { _id: "$driver", averageRating: { $avg: "$rating" }, totalReviews: { $sum: 1 } } }]);
  await Driver.findByIdAndUpdate(ride.driver, { averageRating: stats[0].averageRating, totalReviews: stats[0].totalReviews });
  res.status(201).json(review);
});

export const listReviews = asyncHandler(async (req, res) => {
  const filter = req.query.driver ? { driver: req.query.driver } : {};
  res.json(await Review.find(filter).populate("rider", "name").sort({ createdAt: -1 }));
});
