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
  try {
    const { orderItems, shippingAddress, totalPrice, paymentInfo } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    const order = new Order({
      user: req.user._id,
      orderItems: orderItems.map((item) => ({
        product: item.product,
        quantity: item.quantity,
        selectedSize: item.selectedSize || "M",
        selectedColor: item.selectedColor || "Default",
        priceAtTime: item.priceAtPurchase || 0,
      })),
      shippingAddress,
      subtotal: req.body.subtotal || 0,
      shippingPrice: req.body.shippingPrice || 0,
      taxPrice: req.body.taxPrice || 0,
      discount: req.body.discount || 0,
      totalPrice,
      paymentInfo: paymentInfo || { method: "Mock Payment", status: "Completed" },
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @desc    Get logged-in user's orders (optionally filter by status)
 * @route   GET /api/orders/myorders
 * @access  Private
 */
router.get("/myorders", protect, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { user: req.user._id };
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .sort("-createdAt")
      .populate("orderItems.product", "name price imageUrl sku");

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
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
    const processing = await Order.countDocuments({ status: "Processing" });
    const shipped = await Order.countDocuments({ status: "Shipped" });
    const delivered = await Order.countDocuments({ status: "Delivered" });

    const revenueAgg = await Order.aggregate([{ $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } }]);
    const totalRevenue = revenueAgg[0]?.totalRevenue || 0;

    res.json({ totalOrders, pending, processing, shipped, delivered, totalRevenue });
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
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    // update timestamps for shipped/delivered
    if (status === "Shipped") order.tracking.shippedAt = new Date();
    if (status === "Delivered") order.tracking.deliveredAt = new Date();

    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @desc    Update tracking info (Admin)
 * @route   PUT /api/orders/:id/tracking
 * @access  Private/Admin
 */
router.put("/:id/tracking", protect, admin, async (req, res) => {
  try {
    const { courier, trackingNumber, estimatedDelivery } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.tracking.courier = courier || order.tracking.courier;
    order.tracking.trackingNumber = trackingNumber || order.tracking.trackingNumber;
    order.tracking.estimatedDelivery = estimatedDelivery ? new Date(estimatedDelivery) : order.tracking.estimatedDelivery;
    await order.save();

    res.json({ message: "Tracking updated", tracking: order.tracking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @desc    Cancel an order (User) if still Pending or Processing
 * @route   PUT /api/orders/:id/cancel
 * @access  Private
 */
router.put("/:id/cancel", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Not authorized" });

    if (["Pending", "Processing"].includes(order.status)) {
      order.status = "Cancelled";
      await order.save();
      return res.json({ message: "Order cancelled", order });
    }

    res.status(400).json({ message: "Cannot cancel an order after it has been shipped" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @desc    Request a return for an order (User)
 * @route   POST /api/orders/:id/return
 * @body    { reason, items: [{ orderItemId, qty }] }
 * @access  Private
 */
router.post("/:id/return", protect, async (req, res) => {
  try {
    const { reason, items } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Not authorized" });

    // attach a simple return request object to order (extend schema if needed)
    order.returnRequest = {
      requestedAt: new Date(),
      reason: reason || "Not specified",
      items: items || [],
      status: "Requested", // Admin will approve/deny
    };

    await order.save();
    res.json({ message: "Return requested", returnRequest: order.returnRequest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @desc    Admin approve/deny return
 * @route   PUT /api/orders/:id/return
 * @body    { action: "approve"|"deny", note }
 * @access  Private/Admin
 */
router.put("/:id/return", protect, admin, async (req, res) => {
  try {
    const { action, note } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (!order.returnRequest) return res.status(400).json({ message: "No return request found" });

    if (action === "approve") {
      order.returnRequest.status = "Approved";
      order.status = "Returned";
      order.returnRequest.adminNote = note || "";
      order.returnRequest.processedAt = new Date();
    } else {
      order.returnRequest.status = "Denied";
      order.returnRequest.adminNote = note || "";
      order.returnRequest.processedAt = new Date();
    }

    await order.save();
    res.json({ message: `Return ${action}d`, returnRequest: order.returnRequest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
