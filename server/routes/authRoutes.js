import express from "express";
import { login, me, register, updateProfile } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";

const router = express.Router();

router.post("/register", validate({ name: { required: true }, email: { required: true }, password: { required: true } }), register);
router.post("/login", validate({ email: { required: true }, password: { required: true } }), login);
router.get("/me", protect, me);
router.put("/profile", protect, updateProfile);

export default router;
