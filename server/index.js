import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/database.js";
import colors from "colors";
import fileUpload from "express-fileupload";

import { notFound, errorHandler } from "./middleware/errorHandlerMiddleware.js";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import favouriteRoutes from "./routes/favouriteRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import addressRoutes from "./routes/addressRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: ["https://shopez-ecommerce.netlify.app", "http://localhost:5173", "https://www.shopez-ecommerce.netlify.app", "https://e-commerce-azure-gamma-29.vercel.app", "https://www.e-commerce-azure-gamma-29.vercel.app/"],
  credentials: true
}));
app.use(express.json());
app.use(fileUpload());

app.use("/api/user", authRoutes);
app.use("/api/product", productRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/favourite", favouriteRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/payment", paymentRoutes);

app.get("/", (req, res) => {
  res.send("API is running.......");
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`.yellow.bold);
});
