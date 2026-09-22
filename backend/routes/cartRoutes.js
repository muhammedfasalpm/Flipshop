import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  addToCart,
  getCart,
  updateQuantity,
  removeFromCart,
  clearCart,
} from "../controllers/cartController.js";

const router = express.Router();

router.post("/add", protect, addToCart);
router.get("/:userId", protect, getCart);
router.put("/update/:productId", protect, updateQuantity);
router.delete("/remove/:productId", protect, removeFromCart);
router.delete("/clear/:userId", protect, clearCart);

export default router;