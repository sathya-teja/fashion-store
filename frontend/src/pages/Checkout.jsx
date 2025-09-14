import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Checkout = () => {
  const { cart } = useCart();
  const navigate = useNavigate();

  // ✅ Use fullName instead of name
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
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Checkout</h2>

      <form
        onSubmit={handleProceedToPayment}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Shipping Form */}
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold mb-4">Shipping Information</h3>

          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={shipping.fullName}
            onChange={handleChange}
            className="w-full border p-2 mb-3 rounded"
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={shipping.phone}
            onChange={handleChange}
            className="w-full border p-2 mb-3 rounded"
          />
          <input
            type="text"
            name="address"
            placeholder="Street Address"
            value={shipping.address}
            onChange={handleChange}
            className="w-full border p-2 mb-3 rounded"
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={shipping.city}
            onChange={handleChange}
            className="w-full border p-2 mb-3 rounded"
          />
          <input
            type="text"
            name="postalCode"
            placeholder="Postal Code"
            value={shipping.postalCode}
            onChange={handleChange}
            className="w-full border p-2 mb-3 rounded"
          />
        </div>

        {/* Order Summary */}
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

          {cart.items.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            <ul className="mb-4">
              {cart.items.map((item) => (
                <li
                  key={item.product._id}
                  className="flex justify-between mb-2"
                >
                  <span>
                    {item.product.name} x {item.quantity}
                  </span>
                  <span>₹{item.product.price * item.quantity}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="flex justify-between font-bold text-lg mb-6">
            <span>Total:</span>
            <span>₹{totalPrice}</span>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          >
            Proceed to Payment
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
