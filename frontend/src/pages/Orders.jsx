import { useEffect, useState } from "react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/orders/myorders", {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch orders");
        setOrders(data);
      } catch (err) {
        setError(err.message);
      }
    };

    if (userInfo) fetchOrders();
  }, [userInfo]);

  if (!userInfo) return <p>Please log in to view your orders.</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li
              key={order._id}
              className="border p-4 rounded shadow hover:shadow-md"
            >
              <p className="font-semibold">Order ID: {order._id}</p>
              <p>Status: {order.status}</p>
              <p>Total: ₹{order.totalPrice}</p>
              <ul className="mt-2">
                {order.orderItems.map((item) => (
                  <li key={item._id}>
                    {item.product.name} (x{item.quantity})
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Orders;
