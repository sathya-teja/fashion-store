export default function Cart() {
  const { cart, fetchCart, removeFromCart } = useCart();
  const [error, setError] = useState("");
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo) fetchCart();
  }, [userInfo]);

  if (!userInfo) return <p>Please log in to view your cart.</p>;
  if (error) return <p>{error}</p>;
  if (!cart) return <p>Loading cart...</p>;

  const total = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const updateQuantity = async (productId, newQty) => {
    try {
      const res = await fetch(`http://localhost:5000/api/cart/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({ quantity: newQty }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update quantity");
      fetchCart(); 
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4 lg:p-6">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

      {cart.items.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.product._id}
                className="flex items-center gap-4 p-4 border rounded-lg shadow-sm bg-white"
              >
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="w-24 h-24 object-cover rounded-md"
                />
                <div className="flex-1">
                  <p className="font-semibold text-lg">{item.product.name}</p>
                  <p className="text-sm text-gray-600">
                    ₹{item.product.price} × {item.quantity}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() =>
                        item.quantity > 1 &&
                        updateQuantity(item.product._id, item.quantity - 1)
                      }
                      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span className="px-4">{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(item.product._id, item.quantity + 1)
                      }
                      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-lg">
                    ₹{item.product.price * item.quantity}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.product._id)}
                    className="text-red-500 text-sm hover:underline mt-1"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Order Summary */}
          <div className="p-6 border rounded-lg shadow-md bg-white h-fit">
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
              className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
