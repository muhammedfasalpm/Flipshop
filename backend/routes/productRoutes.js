import express from "express";

import {
  getProducts,
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/get", getProducts);

router.get("/getone/:id", getProduct);

router.post("/add", addProduct);

router.put("/update/:id", updateProduct);

router.delete("/delete/:id", deleteProduct);

export default router;