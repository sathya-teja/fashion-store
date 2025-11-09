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
        setError(err?.response?.data?.message || "Failed to fetch orders");
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

  // helper to render a safe product object from possible shapes (populated object, id string, or null)
  const normalizeProduct = (prod) => {
    // if prod is null/undefined
    if (!prod) {
      return {
        _id: null,
        name: "Product no longer available",
        price: 0,
        imageUrl: "/images/placeholder.png",
      };
    }

    // if prod is an object with fields
    if (typeof prod === "object") {
      return {
        _id: prod._id ?? prod.id ?? null,
        name: prod.name ?? prod.title ?? "Unnamed product",
        price: Number(prod.price ?? 0),
        imageUrl: prod.imageUrl ?? prod.image ?? "/images/placeholder.png",
      };
    }

    // if prod is a raw id (string)
    return {
      _id: prod,
      name: "Product (deleted or unavailable)",
      price: 0,
      imageUrl: "/images/placeholder.png",
    };
  };

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
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString("en-IN")
                      : "—"}
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
                {order.orderItems.map((item, idx) => {
                  // item.product can be populated object, raw id, or null
                  const prod = normalizeProduct(item.product);
                  const qty = Number(item.quantity ?? 1);
                  const unitPrice = Number(item.priceAtTime ?? prod.price ?? 0);
                  const lineTotal = (unitPrice * qty) || 0;

                  // key: prefer item._id, then product id, then fallback to index
                  const key =
                    item._id ?? prod._id ?? `${order._id}-item-${idx}`;

                  return (
                    <div
                      key={key}
                      className="flex items-center gap-4 border-b pb-3 last:border-b-0 last:pb-0"
                    >
                      <img
                        src={prod.imageUrl}
                        alt={prod.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/images/placeholder.png";
                        }}
                        className="w-16 h-16 rounded object-cover border"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{prod.name}</p>
                        {item.selectedSize && (
                          <p className="text-xs text-gray-500">
                            Size: {item.selectedSize}
                          </p>
                        )}
                        {item.selectedColor && (
                          <p className="text-xs text-gray-500">
                            Color: {item.selectedColor}
                          </p>
                        )}
                        <p className="text-sm text-gray-500">Qty: {qty}</p>
                      </div>
                      <p className="font-semibold text-gray-800">
                        ₹{lineTotal.toFixed(2)}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Order Footer */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4">
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <FaTruck className="text-gray-500" />
                  <span>
                    Shipping to:{" "}
                    {order.shippingAddress?.city || "Address not available"}
                  </span>
                </div>
                <div className="flex items-center gap-1 font-bold text-lg text-gray-800 mt-2 sm:mt-0">
                  <FaRupeeSign />
                  {Number(order.totalPrice ?? 0).toFixed(2)}
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
