import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [cart, setCart] = useState({ items: [] });

  const fetchCart = async () => {
    if (!userInfo) {
      setCart({ items: [] });
      return;
    }
    try {
      const { data } = await axios.get("http://localhost:5000/api/cart", {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      setCart(data);
    } catch {
      setCart({ items: [] });
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!userInfo) {
      alert("Please log in to add items to cart");
      return;
    }
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/cart",
        { productId, quantity }, // ✅ always send "quantity"
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      setCart(data);
    } catch {
      alert("Failed to add to cart");
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const { data } = await axios.delete(
        `http://localhost:5000/api/cart/${productId}`,
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      setCart(data);
    } catch {
      alert("Failed to remove from cart");
    }
  };

  // ✅ Clear cart after successful payment
  const clearCart = () => {
    setCart({ items: [] });
  };

  useEffect(() => {
    fetchCart();
  }, [userInfo]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, fetchCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
