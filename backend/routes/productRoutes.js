import express from "express";
import upload from "../middleware/upload.js";
import { protect, admin } from "../middleware/authMiddleware.js";

import {
  getProducts,
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

// Get all products (Public - Supports search, category filter, sort, pagination)
router.get("/get", getProducts);

// Get single product (Public)
router.get("/getone/:id", getProduct);

// Wrapper middleware for upload to handle file errors in JSON format
const uploadImages = (req, res, next) => {
  upload.array("images", 5)(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || "Image upload failed",
      });
    }
    next();
  });
};

// Add product (Admin Protected)
router.post("/add", protect, admin, uploadImages, addProduct);

// Update product (Admin Protected)
router.put("/update/:id", protect, admin, uploadImages, updateProduct);

// Delete product (Admin Protected)
router.delete("/delete/:id", protect, admin, deleteProduct);

export default router;
