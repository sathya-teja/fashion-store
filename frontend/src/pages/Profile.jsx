import { useEffect, useState } from "react";

const Profile = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");
  const [formData, setFormData] = useState({
    name: userInfo?.name || "",
    email: userInfo?.email || "",
    password: "",
  });
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch user profile (optional since localStorage already has info)
  useEffect(() => {
    const fetchProfile = async () => {
      if (!userInfo) return;
      try {
        const res = await fetch("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setFormData((prev) => ({
            ...prev,
            name: data.name,
            email: data.email,
          }));
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };

    const fetchOrders = async () => {
      if (!userInfo) return;
      try {
        const res = await fetch("http://localhost:5000/api/orders/myorders", {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        const data = await res.json();
        if (res.ok) setOrders(data);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      }
    };

    fetchProfile();
    fetchOrders();
  }, [userInfo]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!userInfo) return;

    try {
      const res = await fetch("http://localhost:5000/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Update failed");

      // Update localStorage so Navbar updates too
      localStorage.setItem("userInfo", JSON.stringify(data));
      setMessage("✅ Profile updated successfully!");
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    }
  };

  if (!userInfo) return <p className="p-6">Please log in to view your profile.</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      {/* Profile Form */}
      <form onSubmit={handleUpdate} className="space-y-4 mb-10">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="New Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Update Profile
        </button>
      </form>

      {message && <p className="mb-6 text-green-500">{message}</p>}

      {/* Order History */}
      <h2 className="text-xl font-semibold mb-4">My Orders</h2>
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
                    {item.product?.name || "Deleted Product"} (x{item.quantity})
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

export default Profile;
