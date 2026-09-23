import dotenv from "dotenv";
dotenv.config({ override: true });

import express from "express";
import cors from "cors";
import path from "path";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";

const app = express();

// Connect Database
connectDB();

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Uploaded Files Statically
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

// Allowed Origins for CORS
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, curl)
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        (origin && origin.endsWith(".vercel.app")) ||
        process.env.NODE_ENV !== "production"
      ) {
        callback(null, true);
      } else {
        callback(new Error(`CORS policy rejection: Origin ${origin} is not allowed`));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

import mongoose from "mongoose";
import User from "./models/User.js";
import Product from "./models/Product.js";

// Health Check Endpoint
app.get("/", (req, res) => {
  res.json({
    status: "online",
    message: "Flipshop REST API Server is running",
    timestamp: new Date().toISOString(),
  });
});

// Safe Production Diagnostic Endpoint
app.get("/api/diagnostic", async (req, res) => {
  try {
    const userCount = await User.countDocuments({});
    const productCount = await Product.countDocuments({});
    const adminUser = await User.findOne({
      $or: [{ email: "fasal@gmail.com" }, { phone: "8129691138" }],
    });
    res.json({
      success: true,
      host: mongoose.connection.host || "NOT CONNECTED",
      databaseName: mongoose.connection.name || "NONE",
      userCount,
      productCount,
      adminStatus: adminUser ? "FOUND" : "NOT FOUND",
      adminRole: adminUser ? adminUser.role : "NONE",
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/coupons", couponRoutes);

// Global 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route Not Found - ${req.originalUrl}`,
  });
});

// Server Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
