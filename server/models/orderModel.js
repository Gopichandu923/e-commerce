import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  qty: { type: Number, required: true, min: 1 },
  image: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Product",
  },
});

const shippingAddressSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  street: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  state: { type: String, required: true, trim: true },
  zipCode: { type: String, required: true, trim: true },
  country: { type: String, default: "India", trim: true },
  phone: { type: String, required: true, trim: true },
});

const paymentResultSchema = new mongoose.Schema({
  id: { type: String },
  status: { type: String },
  update_time: { type: String },
  email_address: { type: String },
  currency: { type: String },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    orderItems: [orderItemSchema],
    shippingAddress: shippingAddressSchema,
    paymentMethod: {
      type: String,
      required: true,
      enum: ["cod", "card", "PayPal", "Stripe", "BankTransfer"],
    },
    paymentResult: paymentResultSchema,
    itemsPrice: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered", "Cancelled", "Refunded"],
      default: "Processing",
    },
    trackingNumber: { type: String },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

orderSchema.pre("save", async function (next) {
  if (this.isModified("orderItems")) {
    this.itemsPrice = this.orderItems.reduce(
      (acc, item) => acc + item.price * item.qty,
      0
    );
    this.totalPrice = this.itemsPrice + this.taxPrice + this.shippingPrice;
  }
  next();
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
