import { useEffect, useState, useMemo } from "react";
import { FaUser, FaRupeeSign, FaSearch } from "react-icons/fa";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // ✅ Memoize userInfo so it doesn’t change every render
  const userInfo = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("userInfo")) || null;
    } catch {
      return null;
    }
  }, []); // only parse once

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userInfo?.isAdmin) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/orders", {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch orders (${res.status})`);
        }

        const data = await res.json();
        const ordersArray = Array.isArray(data) ? data : data.orders || [];
        setOrders(ordersArray);
        setFilteredOrders(ordersArray);
      } catch (err) {
        setError(err.message || "Unexpected error fetching orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userInfo?.token]); // ✅ only re-run if token changes

  // ✅ Debounced filtering
  useEffect(() => {
    const timer = setTimeout(() => {
      let filtered = [...orders];

      if (searchTerm) {
        filtered = filtered.filter(
          (o) =>
            o._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            o.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (statusFilter !== "All") {
        filtered = filtered.filter((o) => o.status === statusFilter);
      }

      setFilteredOrders(filtered);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, statusFilter, orders]);

  // ✅ Status update logic unchanged
  const updateStatus = async (orderId, status) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo?.token || ""}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to update status");
      }

      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status } : o))
      );
    } catch (err) {
      alert(err.message);
    }
  };

  // ✅ Guards
  if (!userInfo?.isAdmin) {
    return (
      <p className="text-center mt-20 text-red-600">
        ❌ Access denied. Admins only.
      </p>
    );
  }

  if (loading) {
    return <p className="text-center mt-20 text-gray-600">Loading orders...</p>;
  }

  if (error) {
    return <p className="text-center mt-20 text-red-600">{error}</p>;
  }

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
        📦 Admin – Manage Orders
      </h1>

      {/* 🔍 Search + Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex items-center border rounded px-3 py-2 w-full sm:w-1/2">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search by Order ID or User Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full outline-none text-sm"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
        </select>
      </div>

      {/* Orders Table */}
      {filteredOrders.length === 0 ? (
        <p className="text-center text-gray-600">No matching orders found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-sm">
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr
                  key={order._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 font-mono text-xs sm:text-sm">
                    {order._id}
                  </td>
                  <td className="px-4 py-3 flex items-center gap-2">
                    <FaUser className="text-gray-400" />
                    {order.user?.name || "Unknown User"}
                  </td>
                  <td className="px-4 py-3 flex items-center gap-1 font-semibold">
                    <FaRupeeSign className="text-gray-500" />
                    {order.totalPrice ?? 0}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : order.status === "Shipped"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.status || "Pending"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status || "Pending"}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      className="border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
