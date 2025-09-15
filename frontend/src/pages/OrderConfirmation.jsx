import { useLocation, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle, FaBoxOpen, FaTruck } from "react-icons/fa";

const OrderConfirmation = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return (
      <p className="text-center mt-20 text-gray-600">
        No order found. Please go back to shop.
      </p>
    );
  }

  const { transactionId, amount, status, shipping, orderedItems } = state;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white shadow-xl rounded-xl p-6 w-full max-w-2xl">
        {status === "success" ? (
          <>
            {/* ✅ Success Icon */}
            <div className="flex justify-center mb-4">
              <FaCheckCircle className="text-green-500 text-5xl" />
            </div>
            <h2 className="text-2xl font-bold text-green-600 mb-6 text-center">
              Payment Successful!
            </h2>

            {/* Order Summary Card */}
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-700">
                <FaBoxOpen className="text-blue-600" /> Order Summary
              </h3>
              <p className="mb-1 text-sm">
                <span className="font-medium">Transaction ID:</span>{" "}
                {transactionId}
              </p>
              <p className="mb-1 text-sm">
                <span className="font-medium">Amount Paid:</span> ₹{amount}
              </p>
              <p className="mb-1 text-sm">
                <span className="font-medium">Status:</span> Paid (Mock Gateway)
              </p>
            </div>

            {/* Shipping Info */}
            {shipping && (
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-700">
                  <FaTruck className="text-green-600" /> Shipping Information
                </h3>
                <p className="text-sm">{shipping.fullName}</p>
                <p className="text-sm">{shipping.phone}</p>
                <p className="text-sm">{shipping.address}</p>
                <p className="text-sm">
                  {shipping.city}, {shipping.postalCode}
                </p>
              </div>
            )}

            {/* Ordered Items */}
            {orderedItems && orderedItems.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-700">
                  Ordered Items
                </h3>
                <ul className="divide-y divide-gray-200">
                  {orderedItems.map((item) => (
                    <li
                      key={item.product._id}
                      className="py-2 flex justify-between text-sm"
                    >
                      <span>
                        {item.product.name} × {item.quantity}
                      </span>
                      <span className="font-semibold">
                        ₹{(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate("/orders")}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                View My Orders
              </button>
              <button
                onClick={() => navigate("/shop")}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Continue Shopping
              </button>
            </div>
          </>
        ) : (
          <>
            {/* ❌ Failure Icon */}
            <div className="flex justify-center mb-4">
              <FaTimesCircle className="text-red-500 text-5xl" />
            </div>
            <h2 className="text-2xl font-bold text-red-600 mb-6 text-center">
              Payment Failed
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              Something went wrong with your payment. Please try again.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate("/checkout")}
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
              >
                Retry Payment
              </button>
              <button
                onClick={() => navigate("/shop")}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Back to Shop
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderConfirmation;
