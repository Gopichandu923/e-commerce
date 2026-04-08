import asyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";

const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
  }

  const verifiedOrderItems = orderItems.map((item) => ({
    name: item.name,
    qty: item.qty,
    image: item.image,
    price: item.price,
    product: item.productId || item.product,
  }));

  const order = new Order({
    user: req.user._id,
    orderItems: verifiedOrderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice: itemsPrice || 0,
    taxPrice: taxPrice || 0,
    shippingPrice: shippingPrice || 0,
    totalPrice: totalPrice || 0,
  });

  const createdOrder = await order.save();

  res.status(201).json(createdOrder);
});
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  });

  // Save order and update product stock
  const createdOrder = await order.save();

  // Update product quantities
  await Promise.all(
    order.orderItems.map(async (item) => {
      await Product.updateOne(
        { _id: item.product },
        { $inc: { countInStock: -item.qty } }
      );
    })
  );

  res.status(201).json(createdOrder);
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email")
    .populate("orderItems.product", "name image");

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  // Check authorization
  if (!req.user.isAdmin && !order.user._id.equals(req.user._id)) {
    res.status(401);
    throw new Error("Not authorized");
  }

  res.json(order);
});

const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  // Verify order belongs to user or admin
  if (!req.user.isAdmin && !order.user.equals(req.user._id)) {
    res.status(401);
    throw new Error("Not authorized");
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = {
    id: req.body.id,
    status: req.body.status,
    update_time: req.body.update_time,
    email_address: req.body.payer?.email_address,
    currency: req.body.currency,
  };
  order.status = "Processing"; // Update status

  const updatedOrder = await order.save();
  res.json(updatedOrder);
});

const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  order.isDelivered = true;
  order.deliveredAt = Date.now();
  order.status = "Delivered";

  const updatedOrder = await order.save();
  res.json(updatedOrder);
});

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({
    createdAt: -1,
  });
  res.json(orders);
});

const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate("user", "id name")
    .sort({ createdAt: -1 });
  res.json(orders);
});

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
};
