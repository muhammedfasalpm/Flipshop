import express from "express";
import upload from "../middleware/upload.js";

import {
  getUsers,
  getProfile,
  updateProfile,
  deleteUser,
  blockUser,
} from "../controllers/userController.js";

const router = express.Router();

// ======================
// Admin
// ======================
router.get("/", getUsers);

router.delete("/delete/:id", deleteUser);

router.put("/block/:id", blockUser);

// ======================
// User Profile
// ======================
router.get("/profile/:id", getProfile);

router.put(
  "/profile/:id",
  upload.single("image"),
  updateProfile
);

export default router;