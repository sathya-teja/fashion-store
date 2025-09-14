import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },
    selectedSize: { type: String }, // e.g., M, L, XL
    selectedColor: { type: String }, // e.g., Red, Blue
    priceAtTime: { type: Number }, // snapshot price (handles price changes)
  },
  { timestamps: true }
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [cartItemSchema],

    coupon: {
      code: { type: String },
      discount: { type: Number, default: 0 }, // %
    },

    subtotal: { type: Number, default: 0 }, // auto calc
    total: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
