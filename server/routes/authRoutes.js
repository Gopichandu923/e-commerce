import express from "express";
import {
  authUser,
  registerUser,
  getUserProfile,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Login route - Public access
router.post("/login", authUser);

// Register route - Public access
router.post("/", registerUser);

// Profile route -
router.get("/profile", protect, getUserProfile);

export default router;
