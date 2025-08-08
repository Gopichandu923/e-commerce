import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import mongoose from "mongoose";

const addToFavorites = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const productId = req.params.productId;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    res.status(400);
    throw new Error("Invalid product ID");
  }

  const user = await User.findById(userId);

  if (user.favorites.includes(productId)) {
    res.status(400);
    throw new Error("Product already in favorites");
  }

  user.favorites.push(productId);
  const updatedUser = await user.save();

  res.status(200).json({
    message: "Product added to favorites",
    favorites: updatedUser.favorites,
  });
});

const removeFromFavorites = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const productId = req.params.productId;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    res.status(400);
    throw new Error("Invalid product ID");
  }

  const user = await User.findById(userId);

  if (!user.favorites.includes(productId)) {
    res.status(404);
    throw new Error("Product not found in favorites");
  }

  user.favorites = user.favorites.filter((id) => id.toString() !== productId);
  await user.save();
  const updatedUser = await User.findById(userId).populate("favorites");
  console.log(updatedUser);
  res.status(200).json({
    message: "Product removed from favorites",
    favorites: updatedUser.favorites,
  });
});

const getFavorites = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId).populate("favorites");

  res.status(200).json(user.favorites);
});

export { getFavorites, addToFavorites, removeFromFavorites };
