import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Heart, Tag, SlidersHorizontal, X, Star } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import API from "../utils/axios";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Parse query once
  const initialFilters = useMemo(() => {
    const queryParams = new URLSearchParams(location.search);
    return {
      gender: queryParams.get("gender") || "",
      type: queryParams.get("type") || "",
      style: queryParams.get("style") || "",
      season: queryParams.get("season") || "",
      search: queryParams.get("search") || "",
    };
  }, [location.search]);

  const [filters, setFilters] = useState(initialFilters);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // ✅ Fetch products function
  const fetchProducts = async () => {
    try {
      setLoading(true);

      let url = "http://localhost:5000/api/products?";
      const queryString = Object.entries(filters)
        .filter(([key, value]) => key !== "search" && value)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join("&");

      if (queryString) url += queryString;

      const { data } = await API.get(url);
      let results = data.products || [];

      // ✅ frontend search filter
      if (filters.search) {
        results = results.filter((p) =>
          p.name.toLowerCase().includes(filters.search.toLowerCase())
        );
      }

      setProducts(results);
    } catch (err) {
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch when filters OR URL changes
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  // ✅ Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Apply filters (updates URL)
  const applyFilters = () => {
    const searchParams = new URLSearchParams(filters);
    navigate(`/shop?${searchParams.toString()}`, { replace: true });
    setMobileFiltersOpen(false);
  };

  const clearFilters = () => {
    const reset = { gender: "", type: "", style: "", season: "", search: "" };
    setFilters(reset);
    navigate("/shop", { replace: true });
    setMobileFiltersOpen(false);
  };

  // ✅ Wishlist helper
  const isInWishlist = (id) => wishlist.some((p) => p._id === id);

  // 🔧 Render star rating
  const renderStars = (rating = 0, numReviews = 0) => {
    const fullStars = Math.round(rating);
    return (
      <div className="flex items-center gap-1 mt-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={12}
            className={
              i < fullStars
                ? "text-yellow-500 fill-yellow-500"
                : "text-gray-300"
            }
          />
        ))}
        <span className="text-gray-500 text-xs">
          ({numReviews || 0})
        </span>
      </div>
    );
  };

  // 🔧 Skeleton Loader
  const SkeletonCard = () => (
    <div className="bg-white rounded-lg shadow-sm p-3 animate-pulse">
      <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-3/4 mb-1"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
    </div>
  );

  // 🔧 Shared Filter UI
  const FilterContent = (
    <div className="space-y-4">
      {/* Gender */}
      <select
        name="gender"
        value={filters.gender}
        onChange={handleFilterChange}
        className="w-full border rounded px-3 py-2 text-sm"
      >
        <option value="">All Genders</option>
        <option value="Men">Men</option>
        <option value="Women">Women</option>
        <option value="Kids">Kids</option>
        <option value="Unisex">Unisex</option>
      </select>

      {/* Type */}
      <select
        name="type"
        value={filters.type}
        onChange={handleFilterChange}
        className="w-full border rounded px-3 py-2 text-sm"
      >
        <option value="">All Types</option>
        <option value="Shirt">Shirt</option>
        <option value="T-Shirt">T-Shirt</option>
        <option value="Pants">Pants</option>
        <option value="Jeans">Jeans</option>
        <option value="Dress">Dress</option>
        <option value="Shoes">Shoes</option>
        <option value="Accessories">Accessories</option>
      </select>

      {/* Style */}
      <select
        name="style"
        value={filters.style}
        onChange={handleFilterChange}
        className="w-full border rounded px-3 py-2 text-sm"
      >
        <option value="">All Styles</option>
        <option value="Casual">Casual</option>
        <option value="Formal">Formal</option>
        <option value="Party">Party</option>
        <option value="Ethnic">Ethnic</option>
        <option value="Sportswear">Sportswear</option>
      </select>

      {/* Season */}
      <select
        name="season"
        value={filters.season}
        onChange={handleFilterChange}
        className="w-full border rounded px-3 py-2 text-sm"
      >
        <option value="">All Seasons</option>
        <option value="Summer">Summer</option>
        <option value="Winter">Winter</option>
        <option value="All-Season">All-Season</option>
      </select>

      {/* Search */}
      <input
        type="text"
        name="search"
        placeholder="Search by name..."
        value={filters.search}
        onChange={handleFilterChange}
        className="w-full border rounded px-3 py-2 text-sm"
      />

      {/* Buttons */}
      <div className="flex gap-2">
        <button
          onClick={applyFilters}
          className="flex-1 text-sm px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Apply
        </button>
        <button
          onClick={clearFilters}
          className="flex-1 text-sm px-4 py-2 border rounded hover:bg-gray-100"
        >
          Clear
        </button>
      </div>
    </div>
  );

  // 🔄 Render
  return (
    <div className="container mx-auto px-4 lg:px-8 py-2 pb-20">
      <div className="flex gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block w-64 bg-gray-50 p-4 rounded-lg shadow-sm sticky top-20 h-fit">
          <h2 className="text-lg font-semibold mb-4">Filters</h2>
          {FilterContent}
        </aside>

        <main className="flex-1">
          {/* Mobile Filter Button */}
          <div className="lg:hidden flex justify-end mb-6 w-full">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="flex items-center gap-2 px-4 py-2 border rounded text-sm hover:bg-gray-100"
            >
              <SlidersHorizontal size={16} /> Filters
            </button>
          </div>

          {/* Mobile Drawer */}
          {mobileFiltersOpen && (
            <div className="fixed inset-0 bg-black/50 z-50 flex">
              <div className="bg-white w-80 max-w-full p-6 overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <button onClick={() => setMobileFiltersOpen(false)}>
                    <X size={20} />
                  </button>
                </div>
                {FilterContent}
              </div>
              <div
                className="flex-1"
                onClick={() => setMobileFiltersOpen(false)}
              ></div>
            </div>
          )}

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : products.length === 0 ? (
            <p className="text-center text-gray-500">No products found.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <Link
                  key={product._id}
                  to={`/product/${product._id}`}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition p-3 flex flex-col h-full relative group"
                >
                  {/* ✅ Sale Badge */}
                  {product.discountPrice &&
                    product.discountPrice < product.price && (
                      <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded flex items-center gap-1">
                        <Tag size={10} /> Sale
                      </span>
                    )}

                  {/* ✅ Wishlist Heart */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (isInWishlist(product._id)) {
                        removeFromWishlist(product._id);
                      } else {
                        addToWishlist(product._id);
                      }
                    }}
                    className={`absolute top-2 right-2 rounded-full p-1 shadow transition z-10 ${
                      isInWishlist(product._id)
                        ? "text-pink-500 bg-white"
                        : "text-gray-400 bg-white/80 hover:text-pink-500"
                    }`}
                  >
                    <Heart
                      size={14}
                      className={isInWishlist(product._id) ? "fill-pink-500" : ""}
                    />
                  </button>

                  {/* ✅ Image */}
                  <div className="rounded-lg overflow-hidden aspect-[3/4] bg-gray-50 flex items-center justify-center">
                    <img
                      src={
                        product.imageUrl ||
                        "https://via.placeholder.com/300x400?text=No+Image"
                      }
                      alt={product.name}
                      className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* ✅ Title + Price + Rating */}
                  <div className="mt-2">
                    <h2 className="text-xs font-semibold text-gray-700 line-clamp-2">
                      {product.name}
                    </h2>
                    {product.discountPrice ? (
                      <p className="text-red-500 font-semibold text-xs">
                        ₹{product.discountPrice}{" "}
                        <span className="line-through text-gray-400 ml-1">
                          ₹{product.price}
                        </span>
                      </p>
                    ) : (
                      <p className="text-gray-500 text-xs">₹{product.price}</p>
                    )}

                    {/* ✅ Ratings */}
                    {renderStars(product.rating, product.numReviews)}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Shop;
