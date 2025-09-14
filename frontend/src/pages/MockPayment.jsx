import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useCart } from "../context/CartContext";
import axios from "axios";

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
    return <p>No checkout data. Please go back to cart.</p>;
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
                quantity: i.quantity, // ✅ schema expects "quantity"
              })),
              shippingAddress: {
                fullName: shipping.fullName, // ✅ schema expects fullName
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

          // ✅ Clear cart after placing order
          clearCart();

          // ✅ Redirect to confirmation page
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
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          💳 Secure Mock Payment
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Cardholder Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
          <input
            type="text"
            placeholder="Card Number (16 digits)"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            maxLength="16"
            className="w-full border rounded px-3 py-2"
          />
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="MM/YY"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              maxLength="5"
              className="w-1/2 border rounded px-3 py-2"
            />
            <input
              type="password"
              placeholder="CVV"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              maxLength="3"
              className="w-1/2 border rounded px-3 py-2"
            />
          </div>
          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? "Processing..." : `Pay ₹${totalAmount}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MockPayment;
