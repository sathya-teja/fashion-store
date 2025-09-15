import { useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

// Simple skeleton loader for cart items
const CartSkeleton = () => (
  <div className="max-w-6xl mx-auto mt-6 px-3 sm:px-4 lg:px-6">
    <h1 className="text-xl sm:text-2xl font-bold mb-6">Shopping Cart</h1>
    <div className="space-y-4">
      {[1, 2].map((n) => (
        <div
          key={n}
          className="animate-pulse flex gap-4 p-4 border rounded-lg shadow bg-white"
        >
          <div className="w-32 h-32 bg-gray-200 rounded-lg" />
          <div className="flex-1 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function Cart() {
  const {
    cart,
    fetchCart,
    removeFromCart,
    updateQuantity,
    initialLoading,
  } = useCart();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo) fetchCart();
  }, [userInfo]);

  if (!userInfo)
    return (
      <p className="text-center mt-10 text-gray-600">
        Please log in to view your cart.
      </p>
    );

  if (initialLoading) return <CartSkeleton />;

  if (!cart || !cart.items?.length)
    return (
      <p className="text-center mt-10 text-gray-600">
        Your cart is empty
      </p>
    );

  const total = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="max-w-6xl mx-auto mt-6 px-3 sm:px-4 lg:px-6">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
        Shopping Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div
              key={item._id}
              className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg shadow bg-white"
            >
              <img
                src={item.product.imageUrl}
                alt={item.product.name}
                className="w-full sm:w-32 h-40 object-cover rounded-lg"
              />

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="font-semibold text-lg">
                    {item.product.name}
                  </h2>
                  <p className="text-gray-500 text-sm">
                    ₹{item.product.price} each
                  </p>
                </div>

                <div className="flex items-center justify-between mt-4">
                  {/* Quantity Controls */}
                  <div className="flex items-center border rounded-full overflow-hidden">
                    <button
                      onClick={() =>
                        item.quantity > 1 &&
                        updateQuantity(item._id, item.quantity - 1)
                      }
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
                    >
                      -
                    </button>
                    <span className="px-4">{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(item._id, item.quantity + 1)
                      }
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
                    >
                      +
                    </button>
                  </div>

                  <p className="font-bold text-lg text-gray-800">
                    ₹{item.product.price * item.quantity}
                  </p>
                </div>

                <div className="flex gap-4 mt-2 text-sm">
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                  <button className="text-blue-600 hover:underline">
                    Save for later
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="p-6 border rounded-lg shadow-md bg-white h-fit sticky top-4">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>₹{total}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Shipping</span>
            <span className="text-green-600">Free</span>
          </div>
          <div className="flex justify-between font-bold text-lg mt-4 border-t pt-2">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          <button
            onClick={() => navigate("/checkout")}
            className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>

      {/* ✅ Mobile Fixed Checkout Button */}
      <div className="lg:hidden fixed bottom-14 left-0 right-0 bg-white border-t shadow px-4 py-3">
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold">Total</span>
          <span className="font-bold text-lg">₹{total}</span>
        </div>
        <button
          onClick={() => navigate("/checkout")}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
