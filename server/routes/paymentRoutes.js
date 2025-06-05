import express from "express";
import {
  createPaymentOrder,
  verifyOrder,
} from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/order").post(protect, createPaymentOrder);

router.route("/verify").post(protect, verifyOrder);

export default router;
