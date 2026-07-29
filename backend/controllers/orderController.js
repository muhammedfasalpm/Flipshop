import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

// Place Order
export const placeOrder = async (req, res) => {
  try {
    const {
      user,
      items,
      shippingAddress,
      paymentMethod,
      totalPrice,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "No order items",
      });
    }

    const order = await Order.create({
      user,
      items,
      shippingAddress,
      paymentMethod,
      totalPrice,
    });

    // Clear Cart after order placed
    await Cart.findOneAndDelete({
      user,
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Orders
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user")
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Single Order
export const getSingleOrder = async (
  req,
  res
) => {
  try {
    const order = await Order.findById(
      req.params.id
    )
      .populate("user")
      .populate("items.product");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Order Status
export const updateOrderStatus = async (
  req,
  res
) => {
  try {
    const order = await Order.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.orderStatus =
      req.body.orderStatus ||
      order.orderStatus;

    await order.save();

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Order
export const deleteOrder = async (
  req,
  res
) => {
  try {
    await Order.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};