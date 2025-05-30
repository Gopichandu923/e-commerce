import express from "express";
import {
  addToFavorites,
  removeFromFavorites,
  getFavorites,
} from "../controllers/favouriteController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getFavorites);
router
  .route("/:productId")
  .post(protect, addToFavorites)
  .delete(protect, removeFromFavorites);

export default router;
