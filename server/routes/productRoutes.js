import express from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getAllCategories,
  getProductsByCategory,
  seacrhProducts,
  uploadImage,
  getMyProducts,
} from "../controllers/productController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(getAllProducts).post(protect, createProduct);
router.route("/upload").post(protect, uploadImage);
router.route("/category/:category").get(getProductsByCategory);
router.route("/categories").get(getAllCategories);
router.route("/search").get(seacrhProducts);
router.route("/my-products").get(protect, getMyProducts);
router
  .route("/:id")
  .get(getProductById)
  .put(protect, updateProduct)
  .delete(protect, deleteProduct);
router.route("/:id/reviews").post(protect, createProductReview);

export default router;
