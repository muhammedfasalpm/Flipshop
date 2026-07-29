
import express from "express";

import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  clearWishlist,
} from "../controllers/wishlistController.js";

const router = express.Router();

// Add Product to Wishlist
router.post("/add", addToWishlist);

// Get User Wishlist
router.get("/:userId", getWishlist);

// Remove Product from Wishlist
router.delete(
  "/remove/:productId",
  removeFromWishlist
);

// Clear Wishlist
router.delete(
  "/clear/:userId",
  clearWishlist
);

export default router;
