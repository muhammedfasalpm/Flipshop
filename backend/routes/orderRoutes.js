import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";

import {
  placeOrder,
  getOrders,
  getSingleOrder,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/orderController.js";

const router = express.Router();

// Place Order (Authenticated)
router.post("/add", protect, placeOrder);

// Get Orders (Authenticated user gets their orders; Admin gets all orders)
router.get("/get", protect, getOrders);

// Get Single Order (Authenticated)
router.get("/get/:id", protect, getSingleOrder);

// Update Order Status (Admin Protected)
router.put("/update/:id", protect, admin, updateOrderStatus);

// Delete Order (Admin Protected)
router.delete("/delete/:id", protect, admin, deleteOrder);

export default router;