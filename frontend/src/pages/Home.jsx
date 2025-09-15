import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { Heart, Tag } from "lucide-react";
import { useWishlist } from "../context/WishlistContext"; // ✅ import wishlist context

import "swiper/css";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist(); // ✅ from context

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/products?featured=true&limit=8"
        );
        setProducts(data.products || []);
        setLoading(false);
      } catch (err) {
        setError("Failed to load featured products");
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const heroSlides = [
    {
      id: "h1",
      img: "https://images.unsplash.com/photo-1521334884684-d80222895322?w=1600",
      heading: "Discover Your Fashion Style",
      sub: "Trendy outfits and timeless classics at your fingertips.",
    },
    {
      id: "h2",
      img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1600",
      heading: "New Arrivals",
      sub: "Fresh looks dropped this week.",
    },
  ];

  const categories = [
    {
      name: "Men",
      img: "https://tse2.mm.bing.net/th/id/OIP.zAcSN38fmio0iJU7ChfT4gHaLH?pid=Api&P=0&h=180",
    },
    {
      name: "Women",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5hy3OQDeTwTLjxqjkiTH6Jb8GXOgpcaX4eg&s",
    },
    {
      name: "Kids",
      img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600",
    },
    {
      name: "Accessories",
      img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600",
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800">
      {/* 🌟 Hero Slider */}
      <section className="w-full">
        <Swiper
          modules={[Autoplay]}
          spaceBetween={0}
          slidesPerView={1}
          autoplay={{ delay: 4000 }}
          loop
        >
          {heroSlides.map((s) => (
            <SwiperSlide key={s.id}>
              <div className="relative w-full overflow-hidden md:rounded-xl md:max-w-6xl md:mx-auto shadow">
                <img
                  src={s.img}
                  alt={s.heading}
                  className="w-full h-[40vh] md:h-[60vh] object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="text-center text-white px-6">
                    <h2 className="text-2xl md:text-4xl font-bold">
                      {s.heading}
                    </h2>
                    <p className="mt-2 md:mt-3 text-sm md:text-lg text-gray-200">
                      {s.sub}
                    </p>
                    <Link
                      to="/shop"
                      className="inline-block mt-4 md:mt-6 bg-accent px-5 py-2 rounded-full text-sm md:text-base font-medium shadow hover:opacity-90"
                    >
                      Shop Now
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* 🏷 Categories */}
      <section className="max-w-6xl mx-auto px-3 md:px-6 mt-8">
        <h3 className="text-lg font-semibold mb-4 border-l-4 border-accent pl-2">
          Shop by Category
        </h3>
        <div className="flex space-x-6 overflow-x-auto scrollbar-hide pb-3">
          {categories.map((cat) => {
            const filterKey = cat.name === "Accessories" ? "type" : "gender";
            return (
              <Link
                to={`/shop?${filterKey}=${encodeURIComponent(cat.name)}`}
                key={cat.name}
                className="flex flex-col items-center text-center flex-shrink-0 group"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden shadow-sm group-hover:shadow-md transition">
                  <img
                    src={cat.img}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <h4 className="mt-2 text-xs md:text-sm font-medium">
                  {cat.name}
                </h4>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ⭐ Featured Products */}
      <section className="max-w-6xl mx-auto px-3 md:px-6 mt-10 pb-20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold border-l-4 border-accent pl-2">
            Featured Picks For You
          </h3>
          <Link to="/shop" className="text-sm text-accent hover:underline">
            See all
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className="bg-white rounded-lg p-4 animate-pulse h-56"
              />
            ))}
          </div>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <Swiper
            modules={[Autoplay]}
            spaceBetween={16}
            slidesPerView={2}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            loop
          >
            {products.map((product) => {
              const inWishlist = wishlist.some((p) => p._id === product._id);

              return (
                <SwiperSlide key={product._id}>
                  <Link
                    to={`/product/${product._id}`}
                    className="bg-white rounded-xl shadow hover:shadow-md transition p-3 relative flex flex-col h-full border border-gray-100 group"
                  >
                    {product.discountPrice && (
                      <span className="absolute top-2 left-2 bg-accent text-white text-[11px] px-2 py-0.5 rounded flex items-center gap-1 ">
                        <Tag size={12} /> Sale
                      </span>
                    )}

                    {/* ❤️ Wishlist Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        inWishlist
                          ? removeFromWishlist(product._id)
                          : addToWishlist(product._id);
                      }}
                      className="absolute top-2 right-2 bg-white/80 rounded-full p-1 shadow hover:text-pink-500 transition"
                    >
                      {inWishlist ? (
                        <Heart size={14} className="fill-pink-500 text-pink-500" />
                      ) : (
                        <Heart size={14} />
                      )}
                    </button>

                    {/* 🔹 Fixed Image Box */}
                    <div className="w-full aspect-[3/4] bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center">
                      <img
                        src={
                          product.imageUrl ||
                          "https://via.placeholder.com/300x400?text=No+Image"
                        }
                        alt={product.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* 🔹 Product Info */}
                    <div className="flex flex-col flex-grow mt-3 justify-between">
                      <div>
                        <h4 className="text-sm font-medium line-clamp-2 h-[40px]">
                          {product.name}
                        </h4>
                        {product.discountPrice ? (
                          <p className="text-accent font-semibold text-sm">
                            ₹{product.discountPrice}
                            <span className="line-through text-gray-400 ml-2">
                              ₹{product.price}
                            </span>
                          </p>
                        ) : (
                          <p className="text-gray-500 text-sm">₹{product.price}</p>
                        )}
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              );
            })}
          </Swiper>
        )}
      </section>
    </div>
  );
}
