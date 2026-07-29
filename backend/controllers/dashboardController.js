import Product from "../models/Product.js";
import User from "../models/User.js";
import Order from "../models/Order.js";

export const getDashboardData = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();

    const orders = await Order.find();

    const totalRevenue = orders.reduce(
      (acc, item) => acc + item.totalPrice,
      0
    );

    res.status(200).json({
      totalProducts,
      totalUsers,
      totalOrders,
      totalRevenue,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};