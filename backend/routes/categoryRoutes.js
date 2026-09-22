import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";

import {
  addCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

router.get("/get", getCategories);
router.post("/add", protect, admin, addCategory);
router.put("/update/:id", protect, admin, updateCategory);
router.delete("/delete/:id", protect, admin, deleteCategory);

export default router;
