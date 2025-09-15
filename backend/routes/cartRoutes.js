import express from "express";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * Helper: recalculate subtotal and total (simple)
 * Assumes cart.items[].priceAtTime exists or fallback to product price.
 */
async function calculateCartTotals(cart) {
  let subtotal = 0;
  for (const item of cart.items) {
    const price = item.priceAtTime ?? item.product?.price ?? 0;
    subtotal += price * item.quantity;
  }
  cart.subtotal = subtotal;
  const discountPercent = cart.coupon?.discount ?? 0;
  const discountAmount = (subtotal * discountPercent) / 100;
  cart.total = Math.max(0, subtotal - discountAmount);
  return cart;
}

/**
 * @desc    Get user cart
 * @route   GET /api/cart
 * @access  Private
 */
router.get("/", protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
      "name price discountPrice imageUrl sku"
    );
    if (!cart) return res.json({ items: [] });
    cart = await calculateCartTotals(cart);
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @desc    Add item to cart
 * @route   POST /api/cart
 * @body    { productId, quantity, selectedSize, selectedColor }
 * @access  Private
 */
router.post("/", protect, async (req, res) => {
  try {
    const { productId, quantity = 1, selectedSize, selectedColor } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // check same product + size + color
    const itemIndex = cart.items.findIndex(
      (i) =>
        i.product.toString() === productId &&
        (i.selectedSize || "") === (selectedSize || "") &&
        (i.selectedColor || "") === (selectedColor || "")
    );

    const snapshotPrice = product.discountPrice ?? product.price;

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += Number(quantity);
      // update price snapshot if needed
      cart.items[itemIndex].priceAtTime = snapshotPrice;
    } else {
      cart.items.push({
        product: productId,
        quantity,
        selectedSize,
        selectedColor,
        priceAtTime: snapshotPrice,
      });
    }

    await calculateCartTotals(cart);
    await cart.save();

    res.json(await cart.populate("items.product", "name price discountPrice imageUrl sku"));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @desc    Update item quantity
 * @route   PUT /api/cart/:itemId
 * @access  Private
 */
router.put("/:itemId", protect, async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.id(req.params.itemId);
    if (item) {
      item.quantity = Number(quantity);
      await calculateCartTotals(cart);
      await cart.save();
      return res.json(await cart.populate("items.product", "name price discountPrice imageUrl sku"));
    }

    res.status(404).json({ message: "Item not found in cart" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @desc    Remove item from cart
 * @route   DELETE /api/cart/:itemId
 * @access  Private
 */
router.delete("/:itemId", protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((i) => i._id.toString() !== req.params.itemId);
    await calculateCartTotals(cart);
    await cart.save();

    res.json(await cart.populate("items.product", "name price discountPrice imageUrl sku"));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @desc    Apply coupon to cart (simple: frontend validates coupon code and discount)
 * @route   POST /api/cart/apply-coupon
 * @body    { code, discount }
 * @access  Private
 */
router.post("/apply-coupon", protect, async (req, res) => {
  try {
    const { code, discount } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.coupon = { code, discount: Number(discount) || 0 };
    await calculateCartTotals(cart);
    await cart.save();

    res.json({ message: "Coupon applied", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @desc    Remove coupon from cart
 * @route   POST /api/cart/remove-coupon
 * @access  Private
 */
router.post("/remove-coupon", protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.coupon = { code: "", discount: 0 };
    await calculateCartTotals(cart);
    await cart.save();

    res.json({ message: "Coupon removed", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @desc    Clear cart
 * @route   DELETE /api/cart/clear
 * @access  Private
 */
// ✅ Clear Cart
router.delete("/clear", protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    } else {
      cart.items = [];
      cart.coupon = { code: "", discount: 0 };
      cart.subtotal = 0;
      cart.total = 0;
    }

    await cart.save(); // ✅ always save, even if new cart is created
    res.json({ message: "Cart cleared", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
