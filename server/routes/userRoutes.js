import express from "express";
import { listUsers, updateFavoriteLocations } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", protect, authorize("admin"), listUsers);
router.put("/favorites", protect, authorize("rider"), updateFavoriteLocations);

export default router;
