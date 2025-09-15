import express from "express";
import User from "../models/User.js";
import Product from "../models/Product.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @desc    Add product to wishlist
 * @route   POST /api/wishlist/:productId
 * @access  Private
 */
router.post("/:productId", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const product = await Product.findById(req.params.productId);

    if (!product) return res.status(404).json({ message: "Product not found" });
    if (user.wishlist.includes(product._id)) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }

    user.wishlist.push(product._id);
    await user.save();

    const populatedUser = await User.findById(req.user._id).populate(
      "wishlist",
      "name price discountPrice imageUrl brand type gender"
    );

    res.json({
      message: "Product added to wishlist",
      wishlist: populatedUser.wishlist,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @desc    Remove product from wishlist
 * @route   DELETE /api/wishlist/:productId
 * @access  Private
 */
router.delete("/:productId", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    user.wishlist = user.wishlist.filter((id) => id.toString() !== req.params.productId);
    await user.save();

    const populatedUser = await User.findById(req.user._id).populate(
      "wishlist",
      "name price discountPrice imageUrl brand type gender"
    );

    res.json({
      message: "Removed from wishlist",
      wishlist: populatedUser.wishlist,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @desc    Get user wishlist
 * @route   GET /api/wishlist
 * @access  Private
 */
router.get("/", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "wishlist",
      "name price discountPrice imageUrl brand type gender"
    );

    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
