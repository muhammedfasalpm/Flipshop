import Product from "../models/Product.js";
import User from "../models/User.js";
import Order from "../models/Order.js";
import Category from "../models/Category.js";

export const getDashboardData = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalCategories = await Category.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ orderStatus: "Pending" });
    const processingOrders = await Order.countDocuments({ orderStatus: "Processing" });
    const shippedOrders = await Order.countDocuments({ orderStatus: "Shipped" });
    const completedOrders = await Order.countDocuments({ orderStatus: "Delivered" });
    const cancelledOrders = await Order.countDocuments({ orderStatus: "Cancelled" });

    // Aggregate total revenue
    const revenueResult = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    // Monthly revenue & order count aggregation (Last 6 months)
    const monthlyStats = await Order.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          revenue: { $sum: "$totalPrice" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 6 }
    ]);

    // Format monthly data for easy frontend rendering
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedMonthlyData = monthlyStats.map(item => ({
      name: `${monthNames[item._id.month - 1]} ${item._id.year}`,
      revenue: item.revenue,
      orders: item.count
    }));

    // Category product distribution
    const categoryDistribution = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    const formattedCategoryDistribution = categoryDistribution.map(item => ({
      name: item._id || "Uncategorized",
      value: item.count
    }));

    // Recent orders snippet
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name email");

    res.status(200).json({
      success: true,
      totalProducts,
      totalCategories,
      totalUsers,
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      completedOrders,
      cancelledOrders,
      totalRevenue,
      monthlyData: formattedMonthlyData,
      categoryDistribution: formattedCategoryDistribution,
      statusDistribution: [
        { name: "Pending", value: pendingOrders },
        { name: "Processing", value: processingOrders },
        { name: "Shipped", value: shippedOrders },
        { name: "Delivered", value: completedOrders },
        { name: "Cancelled", value: cancelledOrders }
      ],
      recentOrders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};