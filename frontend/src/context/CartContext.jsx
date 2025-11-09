// src/context/CartContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../utils/axios";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [cart, setCart] = useState({ items: [] });
  const [initialLoading, setInitialLoading] = useState(true);

  const getAuthHeaders = () => {
    const token = JSON.parse(localStorage.getItem("userInfo"))?.token;
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Fetch Cart (returns data or null)
  const fetchCart = async () => {
    if (!userInfo) {
      setCart({ items: [] });
      setInitialLoading(false);
      return { items: [] };
    }
    try {
      const { data } = await API.get("/cart", {
        headers: getAuthHeaders(),
      });
      setCart(data || { items: [] });
      return data;
    } catch (err) {
      console.error("fetchCart error:", err);
      setCart({ items: [] });
      return null;
    } finally {
      setInitialLoading(false);
    }
  };

  // Add to Cart (same optimistic logic, unchanged)
  const addToCart = async (productId, quantity = 1) => {
    if (!userInfo) {
      toast.error("Please log in to add items to cart");
      return;
    }

    // Optimistic update
    setCart((prev) => {
      const existing = prev.items.find((i) => i.product._id === productId);
      let newItems;
      if (existing) {
        newItems = prev.items.map((i) =>
          i.product._id === productId
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      } else {
        newItems = [
          ...prev.items,
          { _id: Date.now().toString(), product: { _id: productId }, quantity },
        ];
      }
      return { ...prev, items: newItems };
    });

    try {
      await API.post(
        "/cart",
        { productId, quantity },
        { headers: getAuthHeaders() }
      );
      toast.success("Added to cart");
    } catch (err) {
      // revert to server snapshot on error
      await fetchCart();
      toast.error("Failed to add to cart");
    }
  };

  // Update Quantity
  const updateQuantity = async (itemId, newQty) => {
    setCart((prev) => ({
      ...prev,
      items: prev.items.map((i) =>
        i._id === itemId ? { ...i, quantity: newQty } : i
      ),
    }));

    try {
      await API.put(`/cart/${itemId}`, { quantity: newQty }, { headers: getAuthHeaders() });
      toast.info("Quantity updated");
    } catch (err) {
      await fetchCart();
      toast.error("Failed to update quantity");
    }
  };

  // Remove Item
  const removeFromCart = async (itemId) => {
    const removedItem = cart.items.find((i) => i._id === itemId);

    setCart((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i._id !== itemId),
    }));

    try {
      await API.delete(`/cart/${itemId}`, { headers: getAuthHeaders() });
    } catch (err) {
      await fetchCart();
      toast.error("Failed to remove item");
      return;
    }

    // Undo toast
    toast(
      <div>
        Removed <b>{removedItem?.product?.name}</b>
        <button
          className="ml-2 underline text-blue-500"
          onClick={() => addToCart(removedItem.product._id, removedItem.quantity)}
        >
          Undo
        </button>
      </div>,
      { autoClose: 3000 }
    );
  };

  // Clear Cart (returns newCart or throws)
  const clearCart = async () => {
    if (!userInfo) {
      setCart({ items: [] });
      try { localStorage.removeItem("cartItems"); } catch(e) {}
      return { items: [] };
    }
    try {
      const { data } = await API.delete("/cart/clear", {
        headers: getAuthHeaders(),
      });
      // backend may return either the new cart or an object with cart field
      const newCart = data?.cart ?? data ?? { items: [] };
      setCart(newCart);
      // clear frontend cache too
      try { localStorage.removeItem("cartItems"); } catch (e) {}
      toast.success("Cart cleared 🛒");
      return newCart;
    } catch (err) {
      console.error("Clear cart error:", err);
      toast.error("Failed to clear cart");
      // bubble up error so callers can fallback if needed
      throw err;
    }
  };

  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo]);

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        fetchCart,
        clearCart,
        initialLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
