import Payment from "../models/paymentModel.js";
import asyncHandler from "express-async-handler";
import Razorpay from "razorpay";
import dotenv from "dotenv";

/*const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});*/

const createPaymentOrder = asyncHandler(async (req, res) => {
  const { amount } = req.body;

  const options = {
    amount: Number(amount),
    currency: "INR",
    receipt: crypto.getRandomBytes(10).toString("hex"),
  };
  razorpayInstance.orders.create(options, (error, order) => {
    if (error) {
      throw new Error(error);
    }
    res.status(201).json(order);
    console.log(order);
  });
});

const verifyOrder = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;
  const sign = razorpay_order_id + "|" + razorpay_payment_id;

  const hashSign = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(sign.toString())
    .digest("hex");
  const isAuthenticated = hashSign === razorpay_signature;

  if (isAuthenticated) {
    const payment = new Payment({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    await payment.save();
    res.status(200).json({ message: "Payment is Successful" });
  } else {
    throw new Error("provide valid details");
  }
});

export { createPaymentOrder, verifyOrder };
