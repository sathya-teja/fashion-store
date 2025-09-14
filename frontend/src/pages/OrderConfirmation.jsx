import { useLocation, useNavigate } from "react-router-dom";

const OrderConfirmation = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) return <p>No order found. Please go back to shop.</p>;

  const { transactionId, amount, status, shipping, orderedItems } = state;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl">
        {status === "success" ? (
          <>
            <h2 className="text-3xl font-bold text-green-600 mb-6 text-center">
              ✅ Payment Successful!
            </h2>

            {/* Order Summary */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
              <p className="mb-1">
                <span className="font-medium">Transaction ID:</span>{" "}
                {transactionId}
              </p>
              <p className="mb-1">
                <span className="font-medium">Amount Paid:</span> ₹{amount}
              </p>
              <p className="mb-1">
                <span className="font-medium">Status:</span> Paid (Mock Gateway)
              </p>
            </div>

            {/* Shipping Info */}
            {shipping && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">
                  Shipping Information
                </h3>
                <p>{shipping.fullName}</p>
                <p>{shipping.phone}</p>
                <p>{shipping.address}</p>
                <p>
                  {shipping.city}, {shipping.postalCode}
                </p>
              </div>
            )}

            {/* Ordered Items */}
            {orderedItems && orderedItems.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Ordered Items</h3>
                <ul className="divide-y divide-gray-200">
                  {orderedItems.map((item) => (
                    <li
                      key={item.product._id}
                      className="py-2 flex justify-between"
                    >
                      <span>
                        {item.product.name} × {item.quantity}
                      </span>
                      <span>
                        ₹{(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* View Orders Button */}
            <div className="text-center">
              <button
                onClick={() => navigate("/orders")}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                View My Orders
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-red-600 mb-6 text-center">
              ❌ Payment Failed
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              Something went wrong with your payment. Please try again.
            </p>
            <div className="text-center">
              <button
                onClick={() => navigate("/checkout")}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
              >
                Retry Payment
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderConfirmation;
