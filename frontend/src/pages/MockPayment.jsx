import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useCart } from "../context/CartContext";
import axios from "axios";
import { FaUser, FaCreditCard, FaCalendarAlt, FaLock } from "react-icons/fa";
import { MdPayment } from "react-icons/md";

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

  // ✅ validate mock payment form
  const validateForm = () => {
    if (!cardNumber || !expiry || !cvv || !name) {
      setError("⚠️ All fields are required.");
      return false;
    }
    if (cardNumber.length !== 16) {
      setError("⚠️ Card number must be 16 digits.");
      return false;
    }
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      setError("⚠️ Expiry must be in MM/YY format.");
      return false;
    }
    if (cvv.length !== 3) {
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

    setTimeout(async () => {
      setLoading(false);

      const isSuccess = Math.random() > 0.2; // 80% chance success
      const transactionId = uuidv4();

      if (isSuccess) {
        try {
          // ✅ Save order to backend
          await axios.post(
            "http://localhost:5000/api/orders",
            {
              orderItems: cart.items.map((i) => ({
                product: i.product._id,
                quantity: i.quantity,
              })),
              shippingAddress: {
                fullName: shipping.fullName,
                address: shipping.address,
                city: shipping.city,
                postalCode: shipping.postalCode,
                phone: shipping.phone,
              },
              totalPrice: totalAmount,
              paymentInfo: {
                method: "Mock Payment",
                transactionId,
                status: "Completed",
              },
            },
            { headers: { Authorization: `Bearer ${userInfo.token}` } }
          );

          clearCart();

          navigate("/order-confirmation", {
            state: {
              transactionId,
              amount: totalAmount,
              shipping,
              orderedItems: cart.items,
              status: "success",
            },
          });
        } catch (err) {
          setError(
            err.response?.data?.message || "❌ Failed to save order in backend."
          );
        }
      } else {
        setError("❌ Payment failed. Please try again.");
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 px-4">
      <div className="bg-white shadow-xl rounded-xl p-6 w-full max-w-md">
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <MdPayment className="text-green-600 text-4xl mb-2" />
          <h2 className="text-2xl font-bold text-gray-800">
            Secure Payment
          </h2>
          <p className="text-gray-500 text-sm">
            Complete your purchase safely
          </p>
        </div>

        {/* Stepper */}
        <div className="flex justify-between items-center mb-6 text-xs font-medium text-gray-600">
          <span className="flex-1 text-center">🛒 Cart</span>
          <span className="flex-1 text-center">🚚 Shipping</span>
          <span className="flex-1 text-center text-green-600">💳 Payment</span>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Payment Form */}
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
              placeholder="Card Number (16 digits)"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
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
                onChange={(e) => setCvv(e.target.value)}
                maxLength="3"
                className="w-full border rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
          </div>

          {/* Pay Button */}
          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg shadow-md hover:bg-green-700 transition font-semibold flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Processing...
              </span>
            ) : (
              <>Pay ₹{totalAmount}</>
            )}
          </button>
        </div>

        {/* Security Note */}
        <p className="text-xs text-gray-400 mt-4 text-center">
          🔒 Your payment is secured and encrypted.
        </p>
      </div>
    </div>
  );
};

export default MockPayment;
