import express from "express";
import {
  getCoupons,
  getCouponById,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  toggleCouponStatus,
  validateCoupon,
} from "../controllers/couponController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public Checkout Coupon Validation
router.post("/validate", validateCoupon);

// Protected Admin Routes
router.route("/").get(protect, admin, getCoupons).post(protect, admin, createCoupon);

router
  .route("/:id")
  .get(protect, admin, getCouponById)
  .put(protect, admin, updateCoupon)
  .delete(protect, admin, deleteCoupon);

router.put("/:id/toggle", protect, admin, toggleCouponStatus);

export default router;
