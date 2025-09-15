import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const WishlistContext = createContext();
export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [wishlist, setWishlist] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);

  // 🔹 Fetch wishlist from backend
  const fetchWishlist = async () => {
    if (!userInfo) {
      setWishlist([]);
      setInitialLoading(false);
      return;
    }
    try {
      const { data } = await axios.get("http://localhost:5000/api/wishlist", {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      setWishlist(data);
    } catch {
      setWishlist([]);
    } finally {
      setInitialLoading(false);
    }
  };

  // 🔹 Add to wishlist
  const addToWishlist = async (productId) => {
    if (!userInfo) {
      toast.error("Please log in to add items to wishlist");
      return;
    }

    // optimistic UI update
    setWishlist((prev) =>
      prev.some((p) => p._id === productId)
        ? prev
        : [...prev, { _id: productId }]
    );

    try {
      const { data } = await axios.post(
        `http://localhost:5000/api/wishlist/${productId}`,
        {},
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      setWishlist(data.wishlist);
      toast.success("Added to wishlist ❤️");
    } catch {
      fetchWishlist();
      toast.error("Failed to add to wishlist");
    }
  };

  // 🔹 Remove from wishlist
  const removeFromWishlist = async (productId) => {
    setWishlist((prev) => prev.filter((p) => p._id !== productId));
    try {
      const { data } = await axios.delete(
        `http://localhost:5000/api/wishlist/${productId}`,
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      setWishlist(data.wishlist);
      toast.info("Removed from wishlist");
    } catch {
      fetchWishlist();
      toast.error("Failed to remove from wishlist");
    }
  };

  useEffect(() => {
    fetchWishlist();

    // 🔹 Listen for login/logout changes
    const handleStorageChange = () => {
      fetchWishlist();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [userInfo?.token]);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        setWishlist,
        addToWishlist,
        removeFromWishlist,
        fetchWishlist,
        initialLoading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
