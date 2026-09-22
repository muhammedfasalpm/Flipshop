import express from "express";
import upload from "../middleware/upload.js";
import { protect, admin } from "../middleware/authMiddleware.js";

import {
  getUsers,
  getProfile,
  updateProfile,
  deleteUser,
  blockUser,
} from "../controllers/userController.js";

const router = express.Router();

// ======================
// Admin Protected User Management
// ======================
router.get("/", protect, admin, getUsers);
router.delete("/delete/:id", protect, admin, deleteUser);
router.put("/block/:id", protect, admin, blockUser);

// ======================
// User Profile (Authenticated)
// ======================
router.get("/profile/:id", protect, getProfile);
router.put("/profile/:id", protect, upload.single("image"), updateProfile);

export default router;