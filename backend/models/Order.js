import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: { type: Number, required: true },
    selectedSize: { type: String },
    selectedColor: { type: String },
    priceAtTime: { type: Number }, // store locked price at purchase
  },
  { timestamps: true }
);

const returnRequestSchema = new mongoose.Schema(
  {
    requestedAt: { type: Date, default: Date.now },
    reason: { type: String, default: "Not specified" },
    items: [
      {
        orderItemId: { type: mongoose.Schema.Types.ObjectId, ref: "OrderItem" },
        qty: { type: Number, default: 1 },
      },
    ],
    status: {
      type: String,
      enum: ["Requested", "Approved", "Denied", "Processed"],
      default: "Requested",
    },
    adminNote: { type: String },
    processedAt: { type: Date },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Idempotency token (optional): used to prevent duplicate orders on retries
    clientOrderRef: { type: String, index: true, sparse: true },

    orderItems: [orderItemSchema],

    shippingAddress: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String },
      country: { type: String, default: "India" },
      postalCode: { type: String, required: true },
      phone: { type: String, required: true },
    },

    paymentInfo: {
      method: { type: String, default: "Mock Payment" }, // Stripe, Razorpay, COD
      transactionId: { type: String },
      status: {
        type: String,
        enum: ["Pending", "Completed", "Failed", "Refunded"],
        default: "Pending",
      },
      paidAt: { type: Date },
    },

    subtotal: { type: Number, required: true, default: 0 },
    shippingPrice: { type: Number, default: 0 },
    taxPrice: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true },

    status: {
      type: String,
      enum: [
        "Pending",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
        "Returned",
      ],
      default: "Pending",
    },

    tracking: {
      courier: { type: String }, // e.g., BlueDart
      trackingNumber: { type: String },
      estimatedDelivery: { type: Date },
      shippedAt: { type: Date },
      deliveredAt: { type: Date },
    },

    // Return request subdocument (optional)
    returnRequest: returnRequestSchema,
  },
  { timestamps: true }
);

// Faster lookup by user
orderSchema.index({ user: 1, createdAt: -1 });

const Order = mongoose.model("Order", orderSchema);
export default Order;
