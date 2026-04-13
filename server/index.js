import express from "express";
import dotenv from "dotenv";
dotenv.config();

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const RENDER_URL = process.env.RENDER_URL || "";

import cors from "cors";
import connectDB from "./config/database.js";
import colors from "colors";
import fileUpload from "express-fileupload";
import path from "path";
import { fileURLToPath } from "url";

import { notFound, errorHandler } from "./middleware/errorHandlerMiddleware.js";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import favouriteRoutes from "./routes/favouriteRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import addressRoutes from "./routes/addressRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import mapplsRoutes from "./routes/mapplsRoutes.js";
import newsletterRoutes from "./routes/newsletterRoutes.js";

connectDB();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
  origin: [FRONTEND_URL, "http://localhost:5173", RENDER_URL, "https://*.render.com"].filter(Boolean),
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
app.use("/api", mapplsRoutes);
app.use("/api/newsletter", newsletterRoutes);

// Serve frontend in production
app.use(express.static(path.join(__dirname, "../client/dist")));

app.get("(.*)", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`.yellow.bold);
});
