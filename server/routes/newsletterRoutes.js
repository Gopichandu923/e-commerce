import express from "express";
import {
  subscribeNewsletter,
  unsubscribeNewsletter,
  getAllSubscribers,
  getSubscriberCount,
} from "../controllers/newsletterController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/subscribe", subscribeNewsletter);
router.post("/unsubscribe", unsubscribeNewsletter);

// Admin routes
router.get("/subscribers", protect, admin, getAllSubscribers);
router.get("/subscribers/count", protect, admin, getSubscriberCount);

export default router;