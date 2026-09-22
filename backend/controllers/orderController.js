import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Coupon from "../models/Coupon.js";

// Place Order
export const placeOrder = async (req, res) => {
  try {
    const { user, items, shippingAddress, paymentMethod, totalPrice, couponCode, couponDiscount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No order items provided",
      });
    }

    const order = await Order.create({
      user: user || req.user?._id,
      items,
      shippingAddress,
      paymentMethod: paymentMethod || "COD",
      totalPrice,
      couponCode: couponCode || "",
      couponDiscount: Number(couponDiscount) || 0,
    });

    // Increment coupon usage if a valid coupon code was applied
    if (couponCode) {
      try {
        await Coupon.findOneAndUpdate(
          { code: couponCode.toUpperCase().trim() },
          { $inc: { usedCount: 1 } }
        );
      } catch (err) {
        console.error("Error updating coupon usedCount:", err);
      }
    }

    // Clear Cart after order placed successfully
    await Cart.findOneAndDelete({ user: user || req.user?._id });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Orders (Supports Search, Status Filter & Pagination)
export const getOrders = async (req, res) => {
  try {
    const { search, status, userId, page, limit } = req.query;

    const queryFilter = {};

    // User filter (for user order history API)
    if (userId) {
      queryFilter.user = userId;
    } else if (req.query.user) {
      queryFilter.user = req.query.user;
    }

    // Status filter
    if (status && status.trim() !== "" && status.trim().toLowerCase() !== "all") {
      queryFilter.orderStatus = new RegExp(`^${status.trim()}$`, "i");
    }

    // Keyword Search
    if (search && search.trim() !== "") {
      const searchRegex = new RegExp(search.trim(), "i");
      queryFilter.$or = [
        { "shippingAddress.fullName": searchRegex },
        { "shippingAddress.phone": searchRegex },
        { "shippingAddress.city": searchRegex },
        { paymentMethod: searchRegex },
      ];
    }

    const pageNum = parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
    const limitNum = parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 10;
    const skip = (pageNum - 1) * limitNum;

    const totalOrders = await Order.countDocuments(queryFilter);
    const orders = await Order.find(queryFilter)
      .populate("user", "name email phone")
      .populate("items.product", "name price images brand category")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const totalPages = Math.ceil(totalOrders / limitNum) || 1;

    res.status(200).json({
      success: true,
      orders,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalOrders,
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

// Get Single Order
export const getSingleOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email phone")
      .populate("items.product", "name price images brand category");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Order Status (Admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.orderStatus = req.body.orderStatus || order.orderStatus;
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Order (Admin)
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    await Order.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};