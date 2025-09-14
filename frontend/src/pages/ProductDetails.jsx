// ProductDetails.jsx
import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
import {
  Heart,
  ShoppingCart,
  Star as StarIcon,
  ArrowLeftRight,
} from "lucide-react";

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [mainImage, setMainImage] = useState("");
  const [qty, setQty] = useState("1"); // string to fix caret issue

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);

  const [related, setRelated] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(false);

  // fetch product
  useEffect(() => {
    let cancelled = false;
    const fetchProduct = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/products/${id}`
        );
        if (cancelled) return;
        setProduct(data);
        setMainImage(data.imageUrl || "");
      } catch (err) {
        console.error(err);
        if (!cancelled) setError("Failed to fetch product details");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchProduct();
    return () => {
      cancelled = true;
    };
  }, [id]);

  // fetch related
  useEffect(() => {
    if (!product) return;
    const fetchRelated = async () => {
      setRelatedLoading(true);
      try {
        const queryKey = product.type
          ? `type=${encodeURIComponent(product.type)}`
          : product.gender
          ? `gender=${encodeURIComponent(product.gender)}`
          : "";
        const url = queryKey
          ? `http://localhost:5000/api/products?${queryKey}&limit=6`
          : `http://localhost:5000/api/products?limit=6`;
        const { data } = await axios.get(url);
        const others = (data.products || []).filter(
          (p) => p._id !== product._id
        );
        setRelated(others.slice(0, 6));
      } catch (err) {
        console.error("related fetch", err);
      } finally {
        setRelatedLoading(false);
      }
    };
    fetchRelated();
  }, [product]);

  // avg rating
  const avgRating = useMemo(() => {
    if (!product?.reviews?.length) return 0;
    const sum = product.reviews.reduce((s, r) => s + (r.rating || 0), 0);
    return +(sum / product.reviews.length).toFixed(1);
  }, [product]);

  // wishlist
  const addToWishlist = async () => {
    if (!userInfo) {
      toast.error("Please log in to add to wishlist");
      return;
    }
    try {
      await axios.post(
        `http://localhost:5000/api/wishlist/${id}`,
        {},
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      toast.success("Added to wishlist!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to add to wishlist");
    }
  };

  // review submit
  const submitReview = async (e) => {
    e.preventDefault();
    if (!userInfo) {
      toast.error("Please log in to write a review");
      return;
    }
    if (!rating || !comment.trim()) {
      toast.error("Please provide rating and comment");
      return;
    }
    try {
      setReviewLoading(true);
      await axios.post(
        `http://localhost:5000/api/reviews/${id}`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      toast.success("Review submitted!");
      setRating(0);
      setComment("");
      const { data } = await axios.get(
        `http://localhost:5000/api/products/${id}`
      );
      setProduct(data);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to submit review");
    } finally {
      setReviewLoading(false);
    }
  };

  // add to cart
  const handleAddToCart = () => {
    addToCart(product._id, Number(qty));
    toast.success("Added to cart!");
  };

  if (loading)
    return (
      <div className="container mx-auto px-6 py-10">
        <div className="animate-pulse grid md:grid-cols-2 gap-8">
          <div className="h-[360px] bg-gray-200 rounded-lg" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-6 bg-gray-200 rounded w-1/3" />
            <div className="h-10 bg-gray-200 rounded" />
            <div className="h-10 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );

  if (error) return <p className="text-center py-10 text-red-500">{error}</p>;
  if (!product) return <p className="text-center py-10">No product found</p>;

  const inStock =
    product.countInStock == null ? true : product.countInStock > 0;

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10">
      <div className="grid md:grid-cols-2 gap-10 items-start">
        {/* Images */}
        <div>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="w-full h-[240px] sm:h-[320px] md:h-[480px] flex items-center justify-center bg-gray-50">
              <img
                src={
                  mainImage ||
                  product.imageUrl ||
                  "https://via.placeholder.com/600x600?text=No+Image"
                }
                alt={product.name}
                className="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-105"
              />
            </div>

            <div className="flex gap-3 p-3 overflow-x-auto">
              {product.imageUrl && (
                <button
                  onClick={() => setMainImage(product.imageUrl)}
                  className={`w-20 h-20 rounded-md overflow-hidden border ${
                    mainImage === product.imageUrl
                      ? "ring-2 ring-accent"
                      : "border-gray-200"
                  }`}
                >
                  <img
                    src={product.imageUrl}
                    alt="thumb"
                    className="w-full h-full object-cover"
                  />
                </button>
              )}
              {Array.isArray(product.images) &&
                product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setMainImage(img)}
                    className={`w-20 h-20 rounded-md overflow-hidden border ${
                      mainImage === img
                        ? "ring-2 ring-accent"
                        : "border-gray-200"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`thumb-${idx}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
            </div>
          </div>

          <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <StarIcon size={16} className="text-yellow-400" />
              <span className="font-semibold">{avgRating}</span>
              <span className="text-gray-500">
                ({product.numReviews || 0})
              </span>
            </div>
            <div className="flex items-center gap-1">
              <ArrowLeftRight size={14} />
              <span className="text-gray-500">SKU: {product.sku || "—"}</span>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-6">
          <h1 className="text-2xl sm:text-3xl font-bold">{product.name}</h1>
          <p className="text-sm text-gray-500">{product.brand || ""}</p>

          <div className="flex items-center gap-4">
            {product.discountPrice ? (
              <div className="flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-extrabold text-accent">
                  ₹{product.discountPrice}
                </span>
                <span className="line-through text-gray-400">
                  ₹{product.price}
                </span>
              </div>
            ) : (
              <span className="text-2xl sm:text-3xl font-extrabold text-accent">
                ₹{product.price}
              </span>
            )}
            {inStock ? (
              <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-sm">
                In stock
              </span>
            ) : (
              <span className="px-2 py-1 bg-red-50 text-red-700 rounded text-sm">
                Out of stock
              </span>
            )}
          </div>

          <p className="text-gray-700">{product.description}</p>

          {/* Qty + Actions */}
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Qty</label>
              <input
                type="number"
                min="1"
                max={product.countInStock || 99}
                value={qty}
                onChange={(e) => {
                  let v = e.target.value;
                  if (v === "") {
                    setQty("");
                    return;
                  }
                  let num = parseInt(v, 10);
                  if (isNaN(num) || num < 1) num = 1;
                  if (product.countInStock && num > product.countInStock)
                    num = product.countInStock;
                  setQty(String(num));
                }}
                className="w-20 border rounded px-2 py-1 text-sm"
              />
            </div>

            <div className="flex gap-3 w-full sm:w-auto">
              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg shadow text-white ${
                  inStock
                    ? "bg-secondary hover:bg-dark"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                <ShoppingCart size={16} />
                Add to cart
              </button>
              <button
                onClick={addToWishlist}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border hover:shadow-sm"
              >
                <Heart size={16} className="text-pink-500" />
                Wishlist
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-12">
        <h2 className="text-xl sm:text-2xl font-bold">Reviews</h2>
        <div className="mt-5 grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            {!product.reviews?.length ? (
              <div className="p-6 bg-gray-50 rounded shadow">
                No reviews yet — be the first to write one.
              </div>
            ) : (
              product.reviews.map((rev) => (
                <div key={rev._id} className="p-4 bg-white rounded shadow">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-sm uppercase">
                        {rev.name ? rev.name[0] : "U"}
                      </div>
                      <div>
                        <div className="font-semibold">{rev.name}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(rev.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <StarIcon
                          key={i}
                          size={14}
                          className={
                            i < rev.rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700">{rev.comment}</p>
                </div>
              ))
            )}
          </div>

          {/* Review form */}
          <div>
            {userInfo ? (
              <form
                onSubmit={submitReview}
                className="bg-white p-4 rounded shadow space-y-3"
              >
                <div className="text-sm font-semibold">Write a review</div>
                <div className="flex gap-2">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const starIndex = i + 1;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setRating(starIndex)}
                        className={`p-1 rounded ${
                          rating >= starIndex
                            ? "bg-yellow-100"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <StarIcon
                          size={20}
                          className={
                            rating >= starIndex
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }
                        />
                      </button>
                    );
                  })}
                </div>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  placeholder="Share your experience..."
                  className="w-full border rounded p-2 text-sm"
                  required
                />
                <button
                  type="submit"
                  disabled={reviewLoading}
                  className="w-full bg-secondary text-white py-2 rounded hover:bg-dark transition"
                >
                  {reviewLoading ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            ) : (
              <div className="p-4 bg-gray-50 rounded shadow text-sm">
                Please{" "}
                <Link to="/login" className="text-primary hover:underline">
                  log in
                </Link>{" "}
                to write a review.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related products */}
      <div className="mt-12">
        <h3 className="text-xl font-semibold">You may also like</h3>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {relatedLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-40 bg-gray-100 rounded animate-pulse"
                />
              ))
            : related.map((rp) => (
                <Link
                  key={rp._id}
                  to={`/product/${rp._id}`}
                  className="bg-white rounded p-3 shadow hover:shadow-md transition flex flex-col"
                >
                  <div className="aspect-[3/4] rounded overflow-hidden bg-gray-50 flex items-center justify-center">
                    <img
                      src={
                        rp.imageUrl ||
                        "https://via.placeholder.com/300x400?text=No+Image"
                      }
                      alt={rp.name}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                  <div className="mt-2 text-sm font-medium line-clamp-2">
                    {rp.name}
                  </div>
                  <div className="mt-auto text-sm text-accent font-semibold">
                    ₹{rp.discountPrice || rp.price}
                  </div>
                </Link>
              ))}
        </div>
      </div>
    </div>
  );
}
