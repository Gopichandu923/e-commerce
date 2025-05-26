import express from "express";
import {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
} from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(protect, addOrderItems) // Create new order
  .get(protect, admin, getOrders); // Get all orders (admin only)

router.route("/myorders").get(protect, getMyOrders); // Get logged in user orders

router.route("/:id").get(protect, getOrderById); // Get order by ID

router.route("/:id/pay").put(protect, updateOrderToPaid); // Update order to paid

router.route("/:id/deliver").put(protect, admin, updateOrderToDelivered); // Update order to delivered (admin only)

export default router;
