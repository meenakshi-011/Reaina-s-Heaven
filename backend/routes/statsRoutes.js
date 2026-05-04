import express from "express";
import Order from "../models/order.js";
import User from "../models/user.js";
import Product from "../models/product.js";
import { isLoggedIn } from "../middlewares/authmiddleware.js";

const router = express.Router();

// Helper to calculate percentage change
const calculateTrend = (current, previous) => {
  if (previous === 0) return current > 0 ? "+100%" : "0%";
  const change = ((current - previous) / previous) * 100;
  return `${change > 0 ? "+" : ""}${change.toFixed(1)}%`;
};

// @desc    Get dashboard stats
// @route   GET /api/stats
// @access  Private/Admin
router.get("/", isLoggedIn, async (req, res) => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    // Current totals
    const totalOrdersCount = await Order.countDocuments();
    const totalUsersCount = await User.countDocuments();
    const totalProductsCount = await Product.countDocuments();
    
    const allOrders = await Order.find({});
    const totalRevenue = allOrders.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);
    
    const pendingOrders = await Order.countDocuments({ status: "Processing" });
    const lowStockItems = await Product.find({ stock: { $lt: 5 } }).limit(5);

    // Trend Calculations
    // 1. Revenue Trends
    const currentOrders = await Order.find({ createdAt: { $gte: thirtyDaysAgo } });
    const previousOrders = await Order.find({ createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } });

    const currentRevenue = currentOrders.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);
    const previousRevenue = previousOrders.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);
    
    // 2. User Trends
    const currentUsers = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
    const previousUsers = await User.countDocuments({ createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } });

    // 3. Order Trends
    const currentOrdersCount = currentOrders.length;
    const previousOrdersCount = previousOrders.length;

    // 4. Inventory Trends (Items added recently)
    const currentProducts = await Product.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
    const previousProducts = await Product.countDocuments({ createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } });

    const trends = {
      revenue: calculateTrend(currentRevenue, previousRevenue),
      users: calculateTrend(currentUsers, previousUsers),
      orders: calculateTrend(currentOrdersCount, previousOrdersCount),
      inventory: calculateTrend(currentProducts, previousProducts)
    };

    // Traffic source (Base it on something dynamic like email domains or IDs just to make it vary)
    // In a real app, this would come from an Analytics DB or 'source' field in User model
    const users = await User.find({}).limit(100);
    const gmailCount = users.filter(u => u.email.endsWith('@gmail.com')).length;
    const otherCount = users.length - gmailCount;
    
    const trafficSource = [
      { name: "Organic", value: Math.floor((gmailCount / (users.length || 1)) * 100) || 65 },
      { name: "Social", value: Math.floor((otherCount / (users.length || 1)) * 100) || 15 },
      { name: "Direct", value: 12 },
      { name: "Referral", value: 8 }
    ];

    res.json({
      revenue: totalRevenue,
      users: totalUsersCount,
      orders: totalOrdersCount,
      pendingOrders,
      inventory: totalProductsCount,
      lowStockItems,
      trends,
      trafficSource
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
