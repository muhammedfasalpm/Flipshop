import express from "express";

import {
  addToCart,
  getCart,
  updateQuantity,
  removeFromCart,
  clearCart,
} from "../controllers/cartController.js";

const router = express.Router();

// Add product to cart
router.post("/add", addToCart);

// Get user cart
router.get("/:userId", getCart);

// Update quantity
router.put("/update/:productId", updateQuantity);

// Remove product from cart
router.delete("/remove/:productId", removeFromCart);

// Clear cart
router.delete("/clear/:userId", clearCart);

export default router;