// OrderConfirmation.jsx (robust: fetches authoritative order by orderId or transactionId)
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle, FaBoxOpen, FaTruck } from "react-icons/fa";
import API from "../utils/axios"; // your axios helper that sets baseURL
import { parseISO, format } from "date-fns";

const OrderConfirmation = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // possible values passed via state from MockPayment:
  // { transactionId, amount, status, shipping, orderedItems, orderId }
  const passed = state || {};

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState(null);

  // Try to obtain token from localStorage (match how you auth in other components)
  const token = JSON.parse(localStorage.getItem("userInfo") || "null")?.token;

  // Utility to compute line total from order item
  const lineTotal = (item) => {
    // prefer priceAtTime stored on order item, fallback to product.price
    const price = item.priceAtTime ?? (item.product && item.product.price) ?? 0;
    return price * (item.quantity || 1);
  };

  useEffect(() => {
    // If we have authoritative orderId, fetch it by scanning myorders
    const fetchOrder = async () => {
      // if no token, can't fetch
      if (!token) {
        setError("Please log in to view your order details.");
        return;
      }

      setLoading(true);
      setError("");

      try {
        // fetch all user orders (your API provides /api/orders/myorders)
        const resp = await API.get("/orders/myorders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const myOrders = resp.data || [];

        // Priority 1: match by orderId (passed.orderId)
        if (passed.orderId) {
          const found = myOrders.find((o) => o._id === passed.orderId);
          if (found) {
            setOrder(found);
            setLoading(false);
            return;
          }
        }

        // Priority 2: match by transactionId (passed.transactionId)
        if (passed.transactionId) {
          const found = myOrders.find(
            (o) => o.paymentInfo?.transactionId === passed.transactionId
          );
          if (found) {
            setOrder(found);
            setLoading(false);
            return;
          }
        }

        // Priority 3: attempt to match by item set/amount (best-effort)
        if (passed.orderedItems && passed.orderedItems.length > 0) {
          const match = myOrders.find((o) => {
            if (!o.orderItems || o.orderItems.length !== passed.orderedItems.length) return false;

            // simple item id + qty match
            return passed.orderedItems.every((pItem) =>
              o.orderItems.some(
                (oi) =>
                  (oi.product._id ? oi.product._id.toString() : oi.product.toString()) ===
                    (pItem.product._id ? pItem.product._id.toString() : pItem.product.toString()) &&
                  Number(oi.quantity) === Number(pItem.quantity)
              )
            );
          });

          if (match) {
            setOrder(match);
            setLoading(false);
            return;
          }
        }

        // If we reach here: no authoritative match found.
        // If state contains enough info, use that as fallback (not ideal but better than nothing)
        if (passed && (passed.orderedItems || passed.transactionId)) {
          setOrder({
            // construct a temporary order-like object based on passed state
            _id: passed.orderId || null,
            paymentInfo: { transactionId: passed.transactionId || null, status: passed.status || "Completed" },
            totalPrice: passed.amount || 0,
            shippingAddress: passed.shipping || null,
            orderItems:
              (passed.orderedItems || []).map((it) => {
                // if passed item has product object (from client), use it; else leave minimal
                return {
                  product: it.product || { name: it.product?.name || "Item", price: it.product?.price || 0, _id: it.product?._id || it.product },
                  quantity: it.quantity,
                  priceAtTime: it.priceAtPurchase ?? (it.product?.price ?? 0),
                };
              }) || [],
          });
          setLoading(false);
          return;
        }

        // nothing to show
        setError("Order not found.");
        setLoading(false);
      } catch (err) {
        console.error("Failed to load order:", err);
        setError(err.response?.data?.message || err.message || "Failed to fetch orders.");
        setLoading(false);
      }
    };

    // If we already have `orderId` or `transactionId` in passed state, attempt to fetch authoritative record
    if (token) {
      fetchOrder();
    } else if (passed && (passed.orderedItems || passed.transactionId)) {
      // If not logged in (rare), but we have passed data, show fallback order
      setOrder({
        _id: passed.orderId || null,
        paymentInfo: { transactionId: passed.transactionId || null, status: passed.status || "Completed" },
        totalPrice: passed.amount || 0,
        shippingAddress: passed.shipping || null,
        orderItems:
          (passed.orderedItems || []).map((it) => ({
            product: it.product || { name: it.product?.name || "Item", price: it.product?.price || 0, _id: it.product?._id || it.product },
            quantity: it.quantity,
            priceAtTime: it.priceAtPurchase ?? (it.product?.price ?? 0),
          })) || [],
      });
    } else {
      setError("No order data available. Please go back to shop.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run only once

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading order details…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="bg-white p-6 rounded shadow text-center max-w-lg">
          <p className="text-red-600 font-semibold mb-3">{error}</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => navigate("/shop")} className="bg-gray-200 px-4 py-2 rounded">Back to shop</button>
            <button onClick={() => navigate("/orders")} className="bg-blue-600 text-white px-4 py-2 rounded">My Orders</button>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <p className="text-center mt-20 text-gray-600">
        No order found. Please go back to shop.
      </p>
    );
  }

  const { paymentInfo, totalPrice, shippingAddress, orderItems } = order;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white shadow-xl rounded-xl p-6 w-full max-w-2xl">
        {paymentInfo?.status === "Completed" || paymentInfo?.status === "completed" || passed.status === "success" ? (
          <>
            <div className="flex justify-center mb-4">
              <FaCheckCircle className="text-green-500 text-5xl" />
            </div>
            <h2 className="text-2xl font-bold text-green-600 mb-6 text-center">
              Payment Successful!
            </h2>

            <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-700">
                <FaBoxOpen className="text-blue-600" /> Order Summary
              </h3>
              <p className="mb-1 text-sm">
                <span className="font-medium">Order ID:</span> {order._id || "—"}
              </p>
              <p className="mb-1 text-sm">
                <span className="font-medium">Transaction ID:</span>{" "}
                {paymentInfo?.transactionId || passed.transactionId || "—"}
              </p>
              <p className="mb-1 text-sm">
                <span className="font-medium">Amount Paid:</span> ₹{(totalPrice ?? passed.amount ?? 0).toFixed(2)}
              </p>
              <p className="mb-1 text-sm">
                <span className="font-medium">Status:</span> Paid (Mock Gateway)
              </p>
              {order.createdAt && (
                <p className="mb-1 text-xs text-gray-500">Placed on: {format(parseISO(order.createdAt), "PPP p")}</p>
              )}
            </div>

            {shippingAddress && (
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-700">
                  <FaTruck className="text-green-600" /> Shipping Information
                </h3>
                <p className="text-sm">{shippingAddress.fullName}</p>
                <p className="text-sm">{shippingAddress.phone}</p>
                <p className="text-sm">{shippingAddress.address}</p>
                <p className="text-sm">
                  {shippingAddress.city}, {shippingAddress.postalCode}
                </p>
              </div>
            )}

            {orderItems && orderItems.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-700">
                  Ordered Items
                </h3>
                <ul className="divide-y divide-gray-200">
                  {orderItems.map((item) => {
                    const prod = item.product || {};
                    const name = prod.name || prod.title || "Item";
                    const qty = item.quantity || 1;
                    const price = item.priceAtTime ?? prod.price ?? 0;
                    return (
                      <li key={prod._id || Math.random()} className="py-2 flex justify-between text-sm">
                        <span>
                          {name} × {qty}
                          {item.selectedSize ? <span className="ml-2 text-xs text-gray-500">Size: {item.selectedSize}</span> : null}
                          {item.selectedColor ? <span className="ml-2 text-xs text-gray-500">Color: {item.selectedColor}</span> : null}
                        </span>
                        <span className="font-semibold">₹{(price * qty).toFixed(2)}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={() => navigate("/orders")} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                View My Orders
              </button>
              <button onClick={() => navigate("/shop")} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition">
                Continue Shopping
              </button>
            </div>
          </>
        ) : (
          <>
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
              <button onClick={() => navigate("/checkout")} className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition">
                Retry Payment
              </button>
              <button onClick={() => navigate("/shop")} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition">
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
