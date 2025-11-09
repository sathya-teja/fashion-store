// MockPayment.jsx (patched: server cart, priceAtPurchase, idempotency, fixed loading)
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useCart } from "../context/CartContext";
import API from "../utils/axios";
import { FaUser, FaCreditCard, FaCalendarAlt, FaLock } from "react-icons/fa";
import { MdPayment } from "react-icons/md";

// Toggle this for deterministic dev testing (true => always succeed)
const MOCK_PAYMENT_ALWAYS_SUCCESS = true;

const MockPayment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { totalAmount, shipping } = state || {};
  const { cart, clearCart } = useCart();
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!totalAmount) {
    return (
      <p className="text-center mt-20 text-gray-600">
        No checkout data. Please go back to cart.
      </p>
    );
  }

  // stricter validation: strip spaces and ensure digits where needed
  const validateForm = () => {
    const cleanCard = cardNumber.replace(/\s+/g, "");
    const cleanCvv = cvv.replace(/\s+/g, "");
    if (!cleanCard || !expiry || !cleanCvv || !name) {
      setError("⚠️ All fields are required.");
      return false;
    }
    if (!/^\d{16}$/.test(cleanCard)) {
      setError("⚠️ Card number must be 16 digits.");
      return false;
    }
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      setError("⚠️ Expiry must be in MM/YY format.");
      return false;
    }
    if (!/^\d{3}$/.test(cleanCvv)) {
      setError("⚠️ CVV must be 3 digits.");
      return false;
    }
    return true;
  };

  const handlePayment = async () => {
    if (!validateForm()) return;
    if (!userInfo) {
      setError("⚠️ Please log in to complete payment.");
      return;
    }

    setError("");
    setLoading(true);

    // small simulated delay for UX; keep loading true until network finishes
    setTimeout(async () => {
      try {
        // Determine success (dev toggle or random)
        const isSuccess = MOCK_PAYMENT_ALWAYS_SUCCESS ? true : Math.random() > 0.2;
        const transactionId = uuidv4();
        const clientOrderRef = `COREF-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

        if (!isSuccess) {
          setLoading(false);
          setError("❌ Payment failed. Please try again.");
          return;
        }

        // 1) Fetch authoritative / server cart immediately before creating order
        const cartResp = await API.get("/cart", {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        const serverCart = cartResp.data;
        if (!serverCart || !serverCart.items || serverCart.items.length === 0) {
          throw new Error("Cart is empty or unavailable.");
        }

        // 2) Build orderItems with price snapshot and attributes
        const orderItems = serverCart.items.map((i) => ({
          product: i.product._id ? i.product._id : i.product,
          quantity: i.quantity,
          selectedSize: i.selectedSize,
          selectedColor: i.selectedColor,
          priceAtPurchase: i.priceAtTime ?? (i.product && i.product.price) ?? 0,
        }));

        // 3) Prepare order body
        const orderBody = {
          clientOrderRef,
          orderItems,
          shippingAddress: {
            fullName: shipping?.fullName ?? "",
            address: shipping?.address ?? "",
            city: shipping?.city ?? "",
            postalCode: shipping?.postalCode ?? "",
            phone: shipping?.phone ?? "",
          },
          subtotal: serverCart.subtotal ?? 0,
          shippingPrice: serverCart.shippingPrice ?? 0,
          taxPrice: serverCart.taxPrice ?? 0,
          discount: serverCart.coupon?.discount ?? 0,
          totalPrice: serverCart.total ?? totalAmount,
          paymentInfo: {
            method: "Mock Payment",
            transactionId,
            status: "Completed",
            paidAt: new Date().toISOString(),
            test: true,
          },
        };

        // 4) Create order on backend and await result
        const createResp = await API.post("/orders", orderBody, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });

        const createdOrder = createResp.data;

        // 5) Clear both backend and frontend cart (your CartContext.clearCart handles server delete and local state)
        await clearCart();

        // 6) Navigate to confirmation — include created order id so confirmation page can fetch authoritative data
        setLoading(false);
        navigate("/order-confirmation", {
          state: {
            transactionId,
            amount: orderBody.totalPrice,
            shipping: orderBody.shippingAddress,
            orderedItems: orderItems,
            status: "success",
            orderId: createdOrder._id,
          },
        });
      } catch (err) {
        console.error("Payment / order creation error:", err);
        setLoading(false);
        setError(err.response?.data?.message || err.message || "❌ Failed to create order.");
      }
    }, 700); // short UX delay
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 px-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <MdPayment className="text-green-600 text-4xl mb-2" />
          <h2 className="text-xl font-bold text-gray-800">Payment Details</h2>
          <p className="text-gray-500 text-sm">Complete your purchase (Mock)</p>
        </div>

        {/* Stepper */}
        <div className="flex justify-between items-center mb-6 text-xs font-medium">
          <span className="flex-1 text-center text-gray-400">Cart</span>
          <span className="flex-1 text-center text-gray-400">Shipping</span>
          <span className="flex-1 text-center text-green-600 font-semibold">Payment</span>
        </div>

        {error && <p className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">{error}</p>}

        <div className="space-y-4">
          <div className="relative">
            <FaUser className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Cardholder Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          <div className="relative">
            <FaCreditCard className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              inputMode="numeric"
              placeholder="Card Number"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ""))}
              maxLength="16"
              className="w-full border rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          <div className="flex space-x-4">
            <div className="relative w-1/2">
              <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                maxLength="5"
                className="w-full border rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
            <div className="relative w-1/2">
              <FaLock className="absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                placeholder="CVV"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                maxLength="3"
                className="w-full border rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
          </div>

          {/* Pay Button */}
          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg shadow hover:bg-green-700 transition font-semibold flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>Pay ₹{totalAmount}</>
            )}
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-4 text-center">🔒 This is a mock payment (no money will be charged).</p>
      </div>
    </div>
  );
};

export default MockPayment;
