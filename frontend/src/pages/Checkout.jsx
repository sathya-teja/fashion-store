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

const Checkout = () => {
  const { cart } = useCart();
  const navigate = useNavigate();

  const [shipping, setShipping] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const totalPrice = cart.items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const handleChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();

    if (
      !shipping.fullName ||
      !shipping.phone ||
      !shipping.address ||
      !shipping.city ||
      !shipping.postalCode
    ) {
      alert("Please fill in all shipping details");
      return;
    }

    navigate("/mock-payment", {
      state: { totalAmount: totalPrice, shipping },
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 pb-24">
      {/* Header */}
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <MdLocalShipping className="text-green-600" size={28} />
        Checkout
      </h2>

      <form onSubmit={handleProceedToPayment} className="space-y-6">
        {/* Shipping Form */}
        <div className="bg-white p-6 rounded-xl shadow-md border">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-700">
            <FaMapMarkerAlt className="text-blue-600" />
            Shipping Information
          </h3>

          <div className="space-y-5">
            {/* Floating input example */}
            <div className="relative">
              <input
                type="text"
                name="fullName"
                value={shipping.fullName}
                onChange={handleChange}
                placeholder=" "
                className="peer w-full border rounded-lg px-3 pt-5 pb-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
              />
              <label className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-600 flex items-center gap-2">
                <FaUser /> Full Name
              </label>
            </div>

            <div className="relative">
              <input
                type="text"
                name="phone"
                value={shipping.phone}
                onChange={handleChange}
                placeholder=" "
                className="peer w-full border rounded-lg px-3 pt-5 pb-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
              />
              <label className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-600 flex items-center gap-2">
                <FaPhone /> Phone Number
              </label>
            </div>

            <div className="relative">
              <input
                type="text"
                name="address"
                value={shipping.address}
                onChange={handleChange}
                placeholder=" "
                className="peer w-full border rounded-lg px-3 pt-5 pb-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
              />
              <label className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-600 flex items-center gap-2">
                <FaMapMarkerAlt /> Street Address
              </label>
            </div>

            <div className="relative">
              <input
                type="text"
                name="city"
                value={shipping.city}
                onChange={handleChange}
                placeholder=" "
                className="peer w-full border rounded-lg px-3 pt-5 pb-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
              />
              <label className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-600 flex items-center gap-2">
                <FaCity /> City
              </label>
            </div>

            <div className="relative">
              <input
                type="text"
                name="postalCode"
                value={shipping.postalCode}
                onChange={handleChange}
                placeholder=" "
                className="peer w-full border rounded-lg px-3 pt-5 pb-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
              />
              <label className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-600 flex items-center gap-2">
                <FaEnvelope /> Postal Code
              </label>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-xl shadow-md border mb-20 lg:mb-0">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-700">
            <RiBillLine className="text-purple-600" />
            Order Summary
          </h3>

          {cart.items.length === 0 ? (
            <p className="text-gray-500">Your cart is empty</p>
          ) : (
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
          )}

          <div className="flex justify-between font-bold text-lg mb-6 border-t pt-4">
            <span>Total:</span>
            <span>₹{totalPrice}</span>
          </div>
        </div>

        {/* ✅ Desktop Button */}
        <div className="hidden lg:block">
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg shadow hover:bg-green-700 transition font-semibold flex items-center justify-center gap-2"
          >
            <MdLocalShipping /> Proceed to Payment
          </button>
        </div>
      </form>

      {/* ✅ Mobile Fixed Button (above bottom nav) */}
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
