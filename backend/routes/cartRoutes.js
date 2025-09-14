import express from "express";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @desc    Get user cart
 * @route   GET /api/cart
 * @access  Private
 */
router.get("/", protect, async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product",
    "name price discountPrice imageUrl"
  );

  if (!cart) return res.json({ items: [] });
  res.json(cart);
});

/**
 * @desc    Add item to cart
 * @route   POST /api/cart
 * @body    { productId, quantity, size, color }
 * @access  Private
 */
router.post("/", protect, async (req, res) => {
  const { productId, quantity, size, color } = req.body;

  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: "Product not found" });

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = new Cart({ user: req.user._id, items: [] });
  }

  // Check if same product+size+color already exists
  const itemIndex = cart.items.findIndex(
    (i) =>
      i.product.toString() === productId &&
      i.size === size &&
      i.color === color
  );

  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += quantity;
  } else {
    cart.items.push({
      product: productId,
      quantity,
      size,
      color,
      priceAtPurchase: product.discountPrice || product.price,
      image: product.imageUrl,
      name: product.name,
    });
  }

  await cart.save();
  res.json(await cart.populate("items.product", "name price discountPrice imageUrl"));
});

/**
 * @desc    Update item quantity
 * @route   PUT /api/cart/:itemId
 * @access  Private
 */
router.put("/:itemId", protect, async (req, res) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) return res.status(404).json({ message: "Cart not found" });

  const item = cart.items.id(req.params.itemId); // find subdocument by _id
  if (item) {
    item.quantity = quantity;
    await cart.save();
    return res.json(await cart.populate("items.product", "name price discountPrice imageUrl"));
  }

  res.status(404).json({ message: "Item not found in cart" });
});

/**
 * @desc    Remove item from cart
 * @route   DELETE /api/cart/:itemId
 * @access  Private
 */
router.delete("/:itemId", protect, async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  cart.items = cart.items.filter((i) => i._id.toString() !== req.params.itemId);
  await cart.save();

  res.json(await cart.populate("items.product", "name price discountPrice imageUrl"));
});

export default router;
