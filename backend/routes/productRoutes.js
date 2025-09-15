import express from "express";
import Product from "../models/Product.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @desc    Get all products (filters + pagination + sorting)
 * @route   GET /api/products?gender=Men&type=Shirt&page=1&limit=12&sort=price
 */
router.get("/", async (req, res) => {
  try {
    const {
      gender,
      type,
      style,
      season,
      search,
      featured,
      bestseller,
      page = 1,
      limit = 12,
      sort = "-createdAt", // newest first
      minPrice,
      maxPrice,
      tag,
    } = req.query;

    let filter = {};

    if (gender) filter.gender = new RegExp(`^${gender}$`, "i");
    if (type) filter.type = new RegExp(`^${type}$`, "i");
    if (style) filter.style = new RegExp(`^${style}$`, "i");
    if (season) filter.season = new RegExp(`^${season}$`, "i");
    if (featured) filter.isFeatured = featured === "true";
    if (bestseller) filter.isBestseller = bestseller === "true";

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (tag) {
      filter.tags = { $in: [new RegExp(tag, "i")] };
    }

    if (search) {
      filter.$or = [
        { name: new RegExp(search, "i") },
        { description: new RegExp(search, "i") },
        { brand: new RegExp(search, "i") },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    // Pagination
    const skip = (page - 1) * limit;

    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments(filter);

    res.json({
      products,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @desc    Get unique categories/filters (for frontend filters)
 * @route   GET /api/products/categories
 * @access  Public
 */
router.get("/categories", async (req, res) => {
  try {
    const genders = await Product.distinct("gender");
    const types = await Product.distinct("type");
    const styles = await Product.distinct("style");
    const seasons = await Product.distinct("season");
    const tags = await Product.distinct("tags");

    res.json({ genders, types, styles, seasons, tags });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @desc    Get single product by ID (with reviews + summary)
 * @route   GET /api/products/:id
 */
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("reviews.user", "name");
    if (!product) return res.status(404).json({ message: "Product not found" });

    const summary = [1, 2, 3, 4, 5].map((star) => ({
      star,
      count: product.reviews.filter((r) => r.rating === star).length,
    }));

    res.json({
      ...product.toObject(),
      reviewSummary: {
        average: product.rating,
        totalReviews: product.numReviews,
        distribution: summary,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @desc    Get similar products
 * @route   GET /api/products/:id/similar
 */
router.get("/:id/similar", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const similar = await Product.find({
      type: product.type,
      gender: product.gender,
      _id: { $ne: product._id },
    })
      .limit(8)
      .select("name price discountPrice imageUrl sku");

    res.json(similar);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Admin product CRUD below (create, bulk, update, stock, delete)
 */

/**
 * @desc    Create a new product (Admin only)
 * @route   POST /api/products
 */
router.post("/", protect, admin, async (req, res) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @desc    Bulk add products (Admin only)
 * @route   POST /api/products/bulk
 */
router.post("/bulk", protect, admin, async (req, res) => {
  try {
    const products = await Product.insertMany(req.body);
    res.status(201).json(products);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @desc    Update a product (Admin only)
 * @route   PUT /api/products/:id
 */
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProduct) return res.status(404).json({ message: "Product not found" });
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @desc    Update product stock only (Admin)
 * @route   PATCH /api/products/:id/stock
 */
router.patch("/:id/stock", protect, admin, async (req, res) => {
  try {
    const { countInStock } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.countInStock = countInStock;
    await product.save();

    res.json({ message: "Stock updated", product });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @desc    Delete a product (Admin only)
 * @route   DELETE /api/products/:id
 */
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
