import express from "express";

import {
  placeOrder,
  getOrders,
  getSingleOrder,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/orderController.js";

const router = express.Router();

// Place Order
router.post("/add", placeOrder);

// Get All Orders
router.get("/get", getOrders);

// Get Single Order
router.get("/get/:id", getSingleOrder);

// Update Order Status
router.put("/update/:id", updateOrderStatus);

// Delete Order
router.delete("/delete/:id", deleteOrder);

export default router;