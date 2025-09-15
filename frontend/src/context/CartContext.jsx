import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [cart, setCart] = useState({ items: [] });
  const [initialLoading, setInitialLoading] = useState(true);

  const fetchCart = async () => {
    if (!userInfo) {
      setCart({ items: [] });
      setInitialLoading(false);
      return;
    }
    try {
      const { data } = await axios.get("http://localhost:5000/api/cart", {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      setCart(data);
    } catch {
      setCart({ items: [] });
    } finally {
      setInitialLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!userInfo) {
      toast.error("Please log in to add items to cart");
      return;
    }

    // ✅ Optimistic update
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
      await axios.post(
        "http://localhost:5000/api/cart",
        { productId, quantity },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      toast.success("Added to cart");
    } catch {
      fetchCart();
      toast.error("Failed to add to cart");
    }
  };

  const updateQuantity = async (itemId, newQty) => {
    setCart((prev) => ({
      ...prev,
      items: prev.items.map((i) =>
        i._id === itemId ? { ...i, quantity: newQty } : i
      ),
    }));

    try {
      await axios.put(
        `http://localhost:5000/api/cart/${itemId}`,
        { quantity: newQty },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      toast.info("Quantity updated");
    } catch {
      fetchCart();
      toast.error("Failed to update quantity");
    }
  };

  const removeFromCart = async (itemId) => {
    const removedItem = cart.items.find((i) => i._id === itemId);

    setCart((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i._id !== itemId),
    }));

    try {
      await axios.delete(`http://localhost:5000/api/cart/${itemId}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      toast.success("Item removed from cart");
    } catch {
      fetchCart();
      toast.error("Failed to remove item");
    }

    // ✅ Optional Undo
    toast.success(
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

  const clearCart = () => {
    setCart({ items: [] });
    toast("Cart cleared 🛒");
  };

  useEffect(() => {
    fetchCart();
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
