import express from "express";
import {
  addAddress,
  updateAddress,
  deleteAddress,
  setMainAddress,
  getAddresses,
  getMainAddress,
} from "../controllers/addressController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getAddresses).post(protect, addAddress);

router
  .route("/:addressId")
  .put(protect, updateAddress)
  .delete(protect, deleteAddress);

router.route("/:addressId/set-main").patch(protect, setMainAddress);

router.route("/main").get(protect, getMainAddress);

export default router;
