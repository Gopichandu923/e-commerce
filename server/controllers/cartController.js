import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import asyncHandler from "express-async-handler";

const addToCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId, quantity = 1 } = req.body;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    res.status(400);
    throw new Error("Invalid product ID");
  }

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const user = await User.findById(userId);

  const existingItemIndex = user.cart.findIndex(
    (item) => item.productId.toString() === productId
  );

  if (existingItemIndex > -1) {
    user.cart[existingItemIndex].quantity += quantity;
  } else {
    user.cart.push({
      productId,
      quantity,
      priceAtAddition: product.price,
    });
  }

  const updatedUser = await user.save();

  res.status(200).json({
    message: "Item added to cart",
    cart: updatedUser.cart,
  });
});

const updateCartItem = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const itemId = req.params.itemId;
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
    res.status(400);
    throw new Error("Invalid quantity");
  }

  const user = await User.findById(userId);

  const cartItem = user.cart.id(itemId);
  if (!cartItem) {
    res.status(404);
    throw new Error("Cart item not found");
  }

  cartItem.quantity = quantity;
  const updatedUser = await user.save();

  res.status(200).json({
    message: "Cart item updated",
    cart: updatedUser.cart,
  });
});

const removeFromCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const itemId = req.params.itemId;

  const user = await User.findById(userId);

  const itemIndex = user.cart.findIndex(
    (item) => item._id.toString() === itemId
  );

  if (itemIndex === -1) {
    res.status(404);
    throw new Error("Cart item not found");
  }

  user.cart.splice(itemIndex, 1);
  const updatedUser = await user.save();

  res.status(200).json({
    message: "Item removed from cart",
    cart: updatedUser.cart,
  });
});

const getCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId).populate("cart.productId");

  res.status(200).json(user.cart);
});

const clearCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId);
  user.cart = [];
  await user.save();

  res.status(200).json({
    message: "Cart cleared",
    cart: [],
  });
});

export { addToCart, updateCartItem, getCart, clearCart, removeFromCart };
