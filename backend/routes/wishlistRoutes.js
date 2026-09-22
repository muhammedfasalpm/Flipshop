import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  clearWishlist,
} from "../controllers/wishlistController.js";

const router = express.Router();

router.post("/add", protect, addToWishlist);
router.get("/:userId", protect, getWishlist);
router.delete("/remove/:productId", protect, removeFromWishlist);
router.delete("/clear/:userId", protect, clearWishlist);

export default router;
