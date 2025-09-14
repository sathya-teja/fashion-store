import mongoose from "mongoose";

// ✅ Review Schema
const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

// ✅ Product Schema
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    brand: { type: String, default: "Generic" },

    price: { type: Number, required: true },
    discountPrice: { type: Number }, // Optional sale price

    imageUrl: { type: String, required: true }, // main image
    images: [
      {
        url: String,
        alt: String,
      },
    ], // gallery

    // 👕 Structured categories
    gender: {
      type: String,
      enum: ["Men", "Women", "Kids", "Unisex"],
      required: true,
    },
    type: {
      type: String,
      enum: [
        "Shirt",
        "T-Shirt",
        "Pants",
        "Jeans",
        "Dress",
        "Shoes",
        "Accessories",
      ],
      required: true,
    },
    style: {
      type: String,
      enum: ["Casual", "Formal", "Party", "Ethnic", "Sportswear"],
      default: "Casual",
    },
    season: {
      type: String,
      enum: ["Summer", "Winter", "All-Season"],
      default: "All-Season",
    },

    // 🏷️ Tags
    tags: [{ type: String }],

    // 📦 Variants
    sizes: [
      {
        size: {
          type: String,
          enum: ["XS", "S", "M", "L", "XL", "XXL"],
        },
        stock: { type: Number, default: 0 },
      },
    ],
    colors: [
      {
        name: String,
        hex: String, // ex: #FF0000
        stock: { type: Number, default: 0 },
      },
    ],

    // 📦 Stock
    countInStock: { type: Number, required: true, default: 0 },

    // 🏆 Flags
    isFeatured: { type: Boolean, default: false },
    isBestseller: { type: Boolean, default: false },

    // 🔑 SKU
    sku: { type: String, unique: true },

    // 🚚 Shipping
    weight: { type: Number }, // grams
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
    },

    // ✅ Reviews
    reviews: [reviewSchema],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },

    // 🌐 SEO metadata
    meta: {
      title: String,
      description: String,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
