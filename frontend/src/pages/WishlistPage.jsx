import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Heart, Eye, Trash2 } from "lucide-react";

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!userInfo) return;
      try {
        const { data } = await axios.get("http://localhost:5000/api/wishlist", {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setWishlist(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, [userInfo]);

  const removeFromWishlist = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/api/wishlist/${productId}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      setWishlist((prev) => prev.filter((item) => item._id !== productId));
    } catch (err) {
      console.error(err);
    }
  };

  if (!userInfo)
    return (
      <div className="container mx-auto p-6 text-center">
        <p className="text-gray-600">
          Please{" "}
          <Link to="/login" className="text-accent font-semibold hover:underline">
            log in
          </Link>{" "}
          to view your wishlist.
        </p>
      </div>
    );

  if (loading) return <p className="p-6 text-center">Loading wishlist...</p>;

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 flex items-center gap-2">
        My Wishlist <Heart className="text-pink-500" />
      </h1>

      {wishlist.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg shadow">
          <Heart size={36} className="mx-auto text-gray-400 mb-3" />
          <p className="text-gray-600 font-medium">
            Your wishlist is empty. Start adding items you love! 💖
          </p>
          <Link
            to="/shop"
            className="mt-4 inline-block bg-accent text-white px-5 py-2 rounded-full shadow hover:opacity-90 transition"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {wishlist.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow hover:shadow-md transition overflow-hidden flex flex-col"
            >
              {/* Product image */}
              <div className="aspect-[3/4] bg-gray-50 flex items-center justify-center overflow-hidden">
                <img
                  src={
                    product.imageUrl ||
                    "https://via.placeholder.com/300x400?text=No+Image"
                  }
                  alt={product.name}
                  className="w-full h-full object-contain p-2"
                />
              </div>

              {/* Product info */}
              <div className="p-3 flex flex-col flex-1">
                <h2 className="text-sm sm:text-base font-medium line-clamp-2">
                  {product.name}
                </h2>

                {/* Price */}
                {product.discountPrice ? (
                  <p className="mt-1 text-accent font-semibold text-sm sm:text-base">
                    ₹{product.discountPrice}{" "}
                    <span className="line-through text-gray-400 ml-1">
                      ₹{product.price}
                    </span>
                  </p>
                ) : (
                  <p className="mt-1 text-gray-700 text-sm sm:text-base">
                    ₹{product.price}
                  </p>
                )}

               {/* Actions */}
<div className="mt-auto flex gap-2 pt-2">
  <Link
    to={`/product/${product._id}`}
    className="flex items-center justify-center gap-1 
               px-1 py-1 text-[11px] 
               lg:px-3 lg:py-2 lg:text-sm
               rounded-md bg-secondary text-white 
               hover:bg-dark transition"
  >
    <Eye size={12} className="lg:size-16 lg:w-4 lg:h-4" /> View
  </Link>

  <button
    onClick={() => removeFromWishlist(product._id)}
    className="flex items-center justify-center gap-1 
               px-1 py-1 text-[11px] text-gray-600 
               lg:px-3 lg:py-2 lg:text-sm 
               rounded-md border 
               hover:bg-red-50 hover:text-red-600 transition"
  >
    <Trash2 size={12} className="lg:w-4 lg:h-4" /> Remove
  </button>
</div>


              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
