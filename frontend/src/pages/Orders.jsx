import { useEffect, useState } from "react";
import { FaBox, FaRupeeSign, FaTruck } from "react-icons/fa";
import API from "../utils/axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await API.get("/orders/myorders", {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setOrders(data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch orders"
        );
      }
    };

    if (userInfo) fetchOrders();
  }, [userInfo]);

  if (!userInfo) {
    return (
      <p className="text-center mt-10 text-gray-600">
        Please log in to view your orders.
      </p>
    );
  }

  if (error) {
    return <p className="text-center mt-10 text-red-600">{error}</p>;
  }

  return (
    <div className="max-w-5xl mx-auto mt-8 px-4">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
        My Orders
      </h1>

      {orders.length === 0 ? (
        <p className="text-gray-600">No orders found.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white p-5 rounded-lg shadow hover:shadow-lg transition"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b pb-3 mb-3">
                <div>
                  <p className="font-semibold text-gray-700">
                    Order ID: <span className="text-gray-900">{order._id}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Placed on:{" "}
                    {new Date(order.createdAt).toLocaleDateString("en-IN")}
                  </p>
                </div>
                <span
                  className={`mt-2 sm:mt-0 px-3 py-1 text-sm rounded-full font-medium ${
                    order.status === "Delivered"
                      ? "bg-green-100 text-green-700"
                      : order.status === "Processing"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              {/* Items */}
              <div className="space-y-3">
                {order.orderItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center gap-4 border-b pb-3 last:border-b-0 last:pb-0"
                  >
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-16 h-16 rounded object-cover border"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold text-gray-800">
                      ₹{item.product.price * item.quantity}
                    </p>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4">
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <FaTruck className="text-gray-500" />
                  <span>Shipping to: {order.shippingAddress.city}</span>
                </div>
                <div className="flex items-center gap-1 font-bold text-lg text-gray-800 mt-2 sm:mt-0">
                  <FaRupeeSign />
                  {order.totalPrice}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
