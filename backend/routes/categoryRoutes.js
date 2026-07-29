import express from "express";

import {
  addCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

router.post("/add", addCategory);

router.get("/get", getCategories);

router.put("/update/:id", updateCategory);

router.delete("/delete/:id", deleteCategory);

export default router;
