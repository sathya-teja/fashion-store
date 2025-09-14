import express from "express";
import Product from "../models/Product.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @desc    Add or update a review for a product
 * @route   POST /api/reviews/:id
 * @access  Private
 */
router.post("/:id", protect, async (req, res) => {
  const { rating, comment } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if user already reviewed
    const existingReview = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (existingReview) {
      existingReview.rating = Number(rating);
      existingReview.comment = comment;
    } else {
      product.reviews.push({
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
      });
    }

    // Recalculate stats
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, r) => acc + r.rating, 0) /
      product.reviews.length;

    await product.save();

    const updatedProduct = await Product.findById(req.params.id).populate(
      "reviews.user",
      "name"
    );

    res.status(201).json({
      message: existingReview ? "Review updated" : "Review added",
      reviews: updatedProduct.reviews,
      rating: updatedProduct.rating,
      numReviews: updatedProduct.numReviews,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * @desc    Get all reviews for a product
 * @route   GET /api/reviews/:id
 * @access  Public
 */
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "reviews.user",
      "name"
    );

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json({
      reviews: product.reviews,
      rating: product.rating,
      numReviews: product.numReviews,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * @desc    Delete a review
 * @route   DELETE /api/reviews/:productId/:reviewId
 * @access  Private (owner or admin)
 */
router.delete("/:productId/:reviewId", protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const review = product.reviews.id(req.params.reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    if (
      review.user.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      return res.status(403).json({ message: "Not authorized to delete review" });
    }

    product.reviews = product.reviews.filter(
      (r) => r._id.toString() !== req.params.reviewId
    );

    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.length > 0
        ? product.reviews.reduce((acc, r) => acc + r.rating, 0) /
          product.reviews.length
        : 0;

    await product.save();

    res.json({
      message: "Review removed",
      reviews: product.reviews,
      rating: product.rating,
      numReviews: product.numReviews,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * @desc    Get review summary (rating distribution)
 * @route   GET /api/reviews/:id/summary
 * @access  Public
 */
router.get("/:id/summary", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    const summary = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    product.reviews.forEach((r) => {
      summary[r.rating] = (summary[r.rating] || 0) + 1;
    });

    res.json({
      rating: product.rating,
      numReviews: product.numReviews,
      distribution: summary,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
