import express from "express";
import {
  authUser,
  registerUser,
  getUserProfile,
  forgotPassword,
  resetPassword,
  verifyEmail,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Login route - Public access
router.post("/login", authUser);

// Register route - Public access
router.post("/", registerUser);

// Forgot password - Public access
router.post("/forgot-password", forgotPassword);

// Reset password - Public access
router.put("/reset-password/:token", resetPassword);

// Verify email - Public access
router.post("/verify-email/:token", verifyEmail);

// Profile route -
router.get("/profile", protect, getUserProfile);

export default router;
