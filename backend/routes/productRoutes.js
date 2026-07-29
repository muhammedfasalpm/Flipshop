
import express from "express";
import upload from "../middleware/upload.js";

import {
  getProducts,
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

// Get all products
router.get("/get", getProducts);

// Get single product
router.get("/getone/:id", getProduct);

// Add product
router.post(
  "/add",
  upload.array("images", 5),
  addProduct
);

// Update product
router.put(
  "/update/:id",
  upload.array("images", 5),
  updateProduct
);

// Delete product
router.delete(
  "/delete/:id",
  deleteProduct
);

export default router;

