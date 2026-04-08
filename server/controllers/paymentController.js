import Payment from "../models/paymentModel.js";
import asyncHandler from "express-async-handler";
import Razorpay from "razorpay";
import crypto from "crypto";

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createPaymentOrder = asyncHandler(async (req, res) => {
  const { amount } = req.body;

  const options = {
    amount: Math.round(amount * 100),
    currency: "INR",
    receipt: crypto.randomBytes(10).toString("hex"),
  };

  try {
    const order = await razorpayInstance.orders.create(options);
    res.status(201).json({
      ...order,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message || "Failed to create payment order");
  }
});

const verifyOrder = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } =
    req.body;

  const sign = razorpay_order_id + "|" + razorpay_payment_id;

  const hashSign = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(sign.toString())
    .digest("hex");

  const isAuthenticated = hashSign === razorpay_signature;

  if (isAuthenticated) {
    const payment = new Payment({
      orderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    await payment.save();
    res.status(200).json({ message: "Payment Successful", verified: true });
  } else {
    res.status(400);
    throw new Error("Invalid payment signature");
  }
});

export { createPaymentOrder, verifyOrder };
