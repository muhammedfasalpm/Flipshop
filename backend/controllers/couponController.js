import Coupon from "../models/Coupon.js";

/**
 * @desc Get all coupons with server-side search, status filter, sorting, and pagination
 * @route GET /api/coupons
 * @access Private/Admin
 */
export const getCoupons = async (req, res) => {
  try {
    const {
      search,
      status,
      type,
      discountType,
      sort = "createdAt_desc",
      page = 1,
      limit = 10,
    } = req.query;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const query = {};

    // Search by Coupon Code
    if (search) {
      query.code = { $regex: search.trim(), $options: "i" };
    }

    // Filter by discount type (support both 'type' and 'discountType')
    const typeParam = type || discountType;
    if (typeParam && ["percentage", "fixed"].includes(typeParam)) {
      query.discountType = typeParam;
    }

    // Filter by Calculated Status
    const now = new Date();

    if (status === "active") {
      query.isActive = true;
      query.startDate = { $lte: now };
      query.expiryDate = { $gte: now };
    } else if (status === "expired") {
      query.expiryDate = { $lt: now };
    } else if (status === "disabled") {
      query.isActive = false;
    } else if (status === "scheduled") {
      query.isActive = true;
      query.startDate = { $gt: now };
    }

    // Sort order
    let sortOptions = { createdAt: -1 };
    if (sort === "createdAt_asc") sortOptions = { createdAt: 1 };
    if (sort === "expiry_asc") sortOptions = { expiryDate: 1 };
    if (sort === "expiry_desc") sortOptions = { expiryDate: -1 };
    if (sort === "discount_desc") sortOptions = { discountValue: -1 };
    if (sort === "discount_asc") sortOptions = { discountValue: 1 };

    const total = await Coupon.countDocuments(query);
    const coupons = await Coupon.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    const totalPages = total > 0 ? Math.ceil(total / limitNum) : 0;

    res.status(200).json({
      success: true,
      coupons,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Get single coupon details by ID
 * @route GET /api/coupons/:id
 * @access Private/Admin
 */
export const getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    res.status(200).json({
      success: true,
      coupon,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Create new Coupon
 * @route POST /api/coupons
 * @access Private/Admin
 */
export const createCoupon = async (req, res) => {
  try {
    const {
      code,
      discountType = "percentage",
      discountValue,
      minOrderValue = 0,
      maxDiscount = 0,
      startDate,
      expiryDate,
      usageLimit = 100,
      isActive = true,
    } = req.body;

    if (!code || discountValue === undefined || !expiryDate) {
      return res.status(400).json({
        success: false,
        message: "Please provide code, discount value, and expiry date",
      });
    }

    const cleanCode = code.toUpperCase().trim();

    // Check code uniqueness
    const existing = await Coupon.findOne({ code: cleanCode });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Coupon code '${cleanCode}' already exists. Please use a unique code.`,
      });
    }

    // Validate percentage
    if (discountType === "percentage" && (discountValue <= 0 || discountValue > 100)) {
      return res.status(400).json({
        success: false,
        message: "Percentage discount value must be between 1 and 100",
      });
    }

    // Validate dates
    const start = startDate ? new Date(startDate) : new Date();
    const expiry = new Date(expiryDate);

    if (expiry <= start) {
      return res.status(400).json({
        success: false,
        message: "Expiry date must be after start date",
      });
    }

    const coupon = await Coupon.create({
      code: cleanCode,
      discountType,
      discountValue: Number(discountValue),
      minOrderValue: Number(minOrderValue) || 0,
      maxDiscount: Number(maxDiscount) || 0,
      startDate: start,
      expiryDate: expiry,
      usageLimit: Number(usageLimit) || 100,
      isActive: Boolean(isActive),
    });

    res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      coupon,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Update existing Coupon
 * @route PUT /api/coupons/:id
 * @access Private/Admin
 */
export const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    const {
      code,
      discountType,
      discountValue,
      minOrderValue,
      maxDiscount,
      startDate,
      expiryDate,
      usageLimit,
      isActive,
    } = req.body;

    if (code) {
      const cleanCode = code.toUpperCase().trim();
      if (cleanCode !== coupon.code) {
        const existing = await Coupon.findOne({ code: cleanCode });
        if (existing) {
          return res.status(400).json({
            success: false,
            message: `Coupon code '${cleanCode}' already exists.`,
          });
        }
        coupon.code = cleanCode;
      }
    }

    if (discountType) coupon.discountType = discountType;
    if (discountValue !== undefined) {
      if (coupon.discountType === "percentage" && (discountValue <= 0 || discountValue > 100)) {
        return res.status(400).json({
          success: false,
          message: "Percentage discount must be between 1 and 100",
        });
      }
      coupon.discountValue = Number(discountValue);
    }

    if (minOrderValue !== undefined) coupon.minOrderValue = Number(minOrderValue);
    if (maxDiscount !== undefined) coupon.maxDiscount = Number(maxDiscount);
    if (startDate) coupon.startDate = new Date(startDate);
    if (expiryDate) coupon.expiryDate = new Date(expiryDate);
    if (usageLimit !== undefined) coupon.usageLimit = Number(usageLimit);
    if (isActive !== undefined) coupon.isActive = Boolean(isActive);

    if (coupon.expiryDate <= coupon.startDate) {
      return res.status(400).json({
        success: false,
        message: "Expiry date must be after start date",
      });
    }

    await coupon.save();

    res.status(200).json({
      success: true,
      message: "Coupon updated successfully",
      coupon,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Toggle Coupon Active/Disabled state
 * @route PUT /api/coupons/:id/toggle
 * @access Private/Admin
 */
export const toggleCouponStatus = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    coupon.isActive = !coupon.isActive;
    await coupon.save();

    res.status(200).json({
      success: true,
      message: `Coupon ${coupon.isActive ? "enabled" : "disabled"} successfully`,
      coupon,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Delete Coupon
 * @route DELETE /api/coupons/:id
 * @access Private/Admin
 */
export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Coupon deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Validate & Calculate Coupon Discount for Customer Checkout
 * @route POST /api/coupons/validate
 * @access Public
 */
export const validateCoupon = async (req, res) => {
  try {
    const { code, cartTotal } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Please enter a coupon code",
      });
    }

    const total = Number(cartTotal) || 0;
    const cleanCode = code.toUpperCase().trim();

    const coupon = await Coupon.findOne({ code: cleanCode });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Invalid coupon code",
      });
    }

    if (!coupon.isActive) {
      return res.status(400).json({
        success: false,
        message: "This coupon code is currently disabled",
      });
    }

    const now = new Date();

    if (coupon.startDate && now < coupon.startDate) {
      return res.status(400).json({
        success: false,
        message: "This coupon is not yet active",
      });
    }

    if (now > coupon.expiryDate) {
      return res.status(400).json({
        success: false,
        message: "This coupon code has expired",
      });
    }

    if (coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({
        success: false,
        message: "This coupon code usage limit has been reached",
      });
    }

    if (total < coupon.minOrderValue) {
      return res.status(400).json({
        success: false,
        message: `Minimum order value of ₹${coupon.minOrderValue.toLocaleString()} required for this coupon`,
      });
    }

    // Calculate Discount
    let discountAmount = 0;
    if (coupon.discountType === "percentage") {
      discountAmount = (total * coupon.discountValue) / 100;
      if (coupon.maxDiscount > 0 && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else {
      discountAmount = Math.min(coupon.discountValue, total);
    }

    const finalAmount = Math.max(0, total - discountAmount);

    res.status(200).json({
      success: true,
      valid: true,
      message: `Coupon '${coupon.code}' applied successfully!`,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discount: Math.round(discountAmount),
      discountAmount: Math.round(discountAmount),
      finalAmount: Math.round(finalAmount),
      finalPayableAmount: Math.round(finalAmount),
      coupon,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
