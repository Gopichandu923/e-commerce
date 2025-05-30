import express from "express";
import {
  addToFavorites,
  removeFromFavorites,
  getFavorites,
} from "../controllers/favouriteController.js";

const router = express.Router();

router.route("/favorites").get(protect, getFavorites);
router
  .route("/favorites/:productId")
  .post(protect, addToFavorites)
  .delete(protect, removeFromFavorites);

export default router;
