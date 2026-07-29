import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import path from "path";

import dashboardRoutes from "./routes/dashboardRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";


dotenv.config();

const app = express();
const __dirname = path.resolve();
// Database Connection
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
// Test Route`
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Routes
app.use("/api/auth", authRoutes);

app.use("/api/products", productRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/users", userRoutes);

app.use("/api/cart", cartRoutes);
  
app.use("/api/wishlist", wishlistRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/categories", categoryRoutes);

app.use("/uploads", express.static("uploads"));


// Server
app.listen(4000, () => {
  console.log("Server running on port 4000");
});
