// Checkout.jsx (Refined E-commerce Style with Validation & Guards)
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import {
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaCity,
  FaEnvelope,
} from "react-icons/fa";
import { MdLocalShipping } from "react-icons/md";
import { RiBillLine } from "react-icons/ri";
import { toast } from "react-toastify";

const Checkout = () => {
  const { cart } = useCart();
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const [shipping, setShipping] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  // ✅ Guards
  if (!userInfo) {
    return (
      <div className="text-center mt-6">
        <p className="text-gray-600">Please log in to continue to checkout.</p>
        <button
          onClick={() => navigate("/login")}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (!cart.items?.length) {
    return (
      <p className="text-center mt-6 text-gray-500">
        Your cart is empty 🛒
      </p>
    );
  }

  const totalPrice = cart.items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const handleChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();

    // ✅ Validations
    if (
      !shipping.fullName ||
      !shipping.phone ||
      !shipping.address ||
      !shipping.city ||
      !shipping.postalCode
    ) {
      toast.error("Please fill in all shipping details");
      return;
    }

    if (!/^\d{10}$/.test(shipping.phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    if (!/^\d{5,6}$/.test(shipping.postalCode)) {
      toast.error("Please enter a valid postal code");
      return;
    }

    // ✅ Navigate to payment
    navigate("/mock-payment", {
      state: { totalAmount: totalPrice, shipping },
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 pb-24">
      {/* Header */}
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <MdLocalShipping className="text-green-600" size={28} />
        Checkout
      </h2>

      <form
        onSubmit={handleProceedToPayment}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Shipping Form */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md border">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-700">
            <FaMapMarkerAlt className="text-blue-600" />
            Shipping Information
          </h3>

          <div className="space-y-5">
            {[
              { name: "fullName", label: "Full Name", icon: <FaUser /> },
              { name: "phone", label: "Phone Number", icon: <FaPhone /> },
              { name: "address", label: "Street Address", icon: <FaMapMarkerAlt /> },
              { name: "city", label: "City", icon: <FaCity /> },
              { name: "postalCode", label: "Postal Code", icon: <FaEnvelope /> },
            ].map((field) => (
              <div key={field.name} className="relative">
                <input
                  type="text"
                  name={field.name}
                  value={shipping[field.name]}
                  onChange={handleChange}
                  placeholder=" "
                  className="peer w-full border rounded-lg px-3 pt-5 pb-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                />
                <label className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-600 flex items-center gap-2">
                  {field.icon} {field.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-xl shadow-md border h-fit lg:sticky lg:top-4">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-700">
            <RiBillLine className="text-purple-600" />
            Order Summary
          </h3>

          <ul className="mb-6 divide-y">
            {cart.items.map((item) => (
              <li
                key={item.product._id}
                className="flex justify-between py-3 text-sm sm:text-base"
              >
                <span className="text-gray-700">
                  {item.product.name} × {item.quantity}
                </span>
                <span className="font-semibold text-gray-800">
                  ₹{item.product.price * item.quantity}
                </span>
              </li>
            ))}
          </ul>

          <div className="flex justify-between text-gray-600 mb-2">
            <span>Subtotal</span>
            <span>₹{totalPrice}</span>
          </div>
          <div className="flex justify-between text-green-600 mb-2">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="flex justify-between font-bold text-lg mb-6 border-t pt-4">
            <span>Total</span>
            <span>₹{totalPrice}</span>
          </div>

          {/* Desktop Button */}
          <div className="hidden lg:block">
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg shadow hover:bg-green-700 transition font-semibold flex items-center justify-center gap-2"
            >
              <MdLocalShipping /> Proceed to Payment
            </button>
          </div>
        </div>
      </form>

      {/* Mobile Fixed Button */}
      <div className="lg:hidden fixed bottom-16 left-0 right-0 bg-white border-t shadow p-4">
        <div className="flex justify-between items-center mb-3">
          <span className="font-semibold">Total</span>
          <span className="font-bold text-lg">₹{totalPrice}</span>
        </div>
        <button
          onClick={handleProceedToPayment}
          className="w-full bg-green-600 text-white py-3 rounded-lg shadow hover:bg-green-700 transition font-semibold flex items-center justify-center gap-2"
        >
          <MdLocalShipping /> Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default Checkout;
