import express from "express";
import Order from "../models/Order.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @desc    Place new order (User)
 * @route   POST /api/orders
 * @access  Private
 */
router.post("/", protect, async (req, res) => {
  const { orderItems, shippingAddress, totalPrice, paymentInfo } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: "No order items" });
  }

  const order = new Order({
    user: req.user._id,
    orderItems: orderItems.map((item) => ({
      product: item.product,
      quantity: item.quantity,
      size: item.size || "M",
      color: item.color || "Default",
      priceAtPurchase: item.priceAtPurchase || 0,
    })),
    shippingAddress,
    totalPrice,
    paymentInfo: paymentInfo || { method: "Mock Payment", status: "Completed" },
  });

  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
});

/**
 * @desc    Get logged-in user's orders
 * @route   GET /api/orders/myorders
 * @access  Private
 */
router.get("/myorders", protect, async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .sort("-createdAt")
    .populate("orderItems.product", "name price imageUrl");

  res.json(orders);
});

/**
 * @desc    Get all orders (Admin) with filters + pagination
 * @route   GET /api/orders?status=Pending&page=1&limit=10
 * @access  Private/Admin
 */
router.get("/", protect, admin, async (req, res) => {
  try {
    const { status, user, startDate, endDate, page = 1, limit = 10, sort = "-createdAt" } = req.query;

    let filter = {};
    if (status) filter.status = status;
    if (user) filter.user = user;
    if (startDate && endDate) {
      filter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const skip = (page - 1) * limit;

    const orders = await Order.find(filter)
      .populate("user", "name email")
      .populate("orderItems.product", "name price imageUrl")
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const total = await Order.countDocuments(filter);

    res.json({
      orders,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @desc    Get order stats (Admin)
 * @route   GET /api/orders/stats
 * @access  Private/Admin
 */
router.get("/stats", protect, admin, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pending = await Order.countDocuments({ status: "Pending" });
    const shipped = await Order.countDocuments({ status: "Shipped" });
    const delivered = await Order.countDocuments({ status: "Delivered" });

    const revenueAgg = await Order.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } },
    ]);
    const totalRevenue = revenueAgg[0]?.totalRevenue || 0;

    res.json({ totalOrders, pending, shipped, delivered, totalRevenue });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @desc    Update order status (Admin only)
 * @route   PUT /api/orders/:id/status
 * @access  Private/Admin
 */
router.put("/:id/status", protect, admin, async (req, res) => {
  const { status } = req.body;
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
