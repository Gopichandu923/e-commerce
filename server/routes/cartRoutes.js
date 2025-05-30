import express from "express";
import {
  addToCart,
  updateCartItem,
  removeFromCart,
  getCart,
  clearCart,
} from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getCart).delete(protect, clearCart);
router.route("/add").post(protect, addToCart);
router
  .route("/:itemId")
  .put(protect, updateCartItem)
  .delete(protect, removeFromCart);
export default router;
