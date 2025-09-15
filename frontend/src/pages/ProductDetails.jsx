// ProductDetails.jsx (Optimized - Reduced Extra Requests)
import { useEffect, useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
import { FavoriteBorder, Favorite, ShoppingBag } from "@mui/icons-material";

import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Chip,
  Rating,
  Card,
  CardContent,
  Avatar,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
  Paper,
} from "@mui/material";
import { useWishlist } from "../context/WishlistContext";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");
  const [related, setRelated] = useState([]);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  // Review state
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const isInWishlist = wishlist.some((p) => p._id === id);

  // ✅ Fetch product (only when id changes)
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/products/${id}`
        );
        setProduct(data);
        setMainImage(data.imageUrl || "");
      } catch (err) {
        toast.error("Failed to fetch product details");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // ✅ Fetch related (only when gender or id changes, not whole product object)
  useEffect(() => {
    if (!product?.gender) return;
    const fetchRelated = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/products?gender=${product.gender}&limit=6`
        );
        setRelated((data.products || []).filter((p) => p._id !== product._id));
      } catch (err) {
        console.error(err);
      }
    };
    fetchRelated();
  }, [product?.gender, product?._id]);

  const avgRating = useMemo(() => {
    if (!product?.reviews?.length) return 0;
    const sum = product.reviews.reduce((s, r) => s + (r.rating || 0), 0);
    return +(sum / product.reviews.length).toFixed(1);
  }, [product]);

  const inStock =
    product?.countInStock == null ? true : product.countInStock > 0;

  const handleWishlist = () => {
    if (!userInfo) {
      toast.error("Please log in to manage wishlist");
      navigate("/login");
      return;
    }

    if (isInWishlist) {
      removeFromWishlist(id);
      toast.success("Removed from wishlist!");
    } else {
      addToWishlist(id);
      toast.success("Added to wishlist!");
    }
  };

  // ✅ Optimized: Don’t re-fetch product after review, patch state locally
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!userInfo) {
      toast.error("Please log in to submit a review");
      return;
    }
    if (!rating || !comment.trim()) {
      toast.error("Please provide a rating and comment");
      return;
    }
    try {
      setSubmitting(true);
      const { data: newReview } = await axios.post(
        `http://localhost:5000/api/reviews/${id}`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      toast.success("Review submitted!");

      // ✅ Append review to state instead of refetching
      setProduct((prev) => ({
        ...prev,
        reviews: [...(prev.reviews || []), newReview],
      }));

      setRating(0);
      setComment("");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;
  if (!product) return <p style={{ textAlign: "center" }}>Product not found</p>;

  return (
    <Container sx={{ pb: { xs: 16, md: 6 } }}>
      {/* --- Image Section --- */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Box
          sx={{
            width: "100%",
            maxWidth: { xs: 320, sm: 400, md: 450 },
            mx: "auto",
            bgcolor: "#f9f9f9",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <img
            src={
              mainImage ||
              product.imageUrl ||
              "https://via.placeholder.com/400x400?text=No+Image"
            }
            alt={product.name || "Unnamed Product"}
            style={{
              width: "100%",
              height: "auto",
              maxHeight: 450,
              objectFit: "contain",
              display: "block",
              margin: "0 auto",
            }}
          />
        </Box>
      </Box>

      {/* Thumbnails */}
      <Box
        sx={{
          display: "flex",
          gap: 1,
          mt: 2,
          overflowX: "auto",
          justifyContent: "center",
        }}
      >
        {[product.imageUrl, ...(product.images || [])].map(
          (img, idx) =>
            img && (
              <Box
                key={idx}
                sx={{
                  border:
                    mainImage === img ? "2px solid #f50057" : "1px solid #ddd",
                  borderRadius: 2,
                  p: 0.5,
                  cursor: "pointer",
                  flexShrink: 0,
                }}
                onClick={() => setMainImage(img)}
              >
                <img
                  src={img}
                  alt={`thumb-${idx}`}
                  style={{
                    width: 70,
                    height: 70,
                    objectFit: "cover",
                    borderRadius: 4,
                  }}
                />
              </Box>
            )
        )}
      </Box>

      {/* --- Product Info --- */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {product.brand || "Generic"}
        </Typography>

        <Box display="flex" alignItems="center" gap={1} mt={1}>
          <Rating value={avgRating} precision={0.5} readOnly size="small" />
          <Typography variant="body2" color="text.secondary">
            {avgRating} ({product.reviews?.length || 0} reviews)
          </Typography>
        </Box>

        {/* Price */}
        <Box mt={2} display="flex" alignItems="center" gap={2}>
          {product.discountPrice ? (
            <>
              <Typography variant="h6" color="secondary" fontWeight="bold">
                ₹{product.discountPrice}
              </Typography>
              <Typography
                variant="body2"
                sx={{ textDecoration: "line-through", color: "text.secondary" }}
              >
                ₹{product.price}
              </Typography>
              <Chip
                label={`-${Math.round(
                  ((product.price - product.discountPrice) / product.price) * 100
                )}%`}
                color="success"
                size="small"
              />
            </>
          ) : (
            <Typography variant="h6">₹{product.price}</Typography>
          )}
        </Box>

        {/* --- Size Selector --- */}
        {product.sizes?.length > 0 && (
          <Box mt={3}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Select Size
            </Typography>
            <ToggleButtonGroup
              value={selectedSize}
              exclusive
              onChange={(e, newSize) => setSelectedSize(newSize)}
              sx={{
                mt: 1,
                "& .MuiToggleButton-root": {
                  borderRadius: "8px",
                  px: 2,
                  py: 1,
                  textTransform: "none",
                  fontWeight: "bold",
                },
              }}
            >
              {product.sizes.map((s, idx) => (
                <ToggleButton key={idx} value={s.size} size="small">
                  {s.size}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>
        )}

        {/* --- Color Selector --- */}
        {product.colors?.length > 0 && (
          <Box mt={3}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Select Color
            </Typography>
            <Box display="flex" gap={2} mt={1}>
              {product.colors.map((c, idx) => (
                <Box
                  key={idx}
                  onClick={() => setSelectedColor(c.name)}
                  sx={{
                    cursor: "pointer",
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    border:
                      selectedColor === c.name
                        ? "3px solid #f50057"
                        : "2px solid #ddd",
                    bgcolor: c.hex || "#ccc",
                    boxShadow:
                      selectedColor === c.name
                        ? "0 0 6px rgba(0,0,0,0.3)"
                        : "none",
                  }}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* --- Description --- */}
        {product.description && (
          <Paper elevation={0} sx={{ p: 2, mt: 3, bgcolor: "#fafafa" }}>
            <Typography variant="body1" color="text.secondary">
              {product.description}
            </Typography>
          </Paper>
        )}
      </Box>

      {/* Sticky Add to Cart + Wishlist */}
      <Box
        sx={{
          position: { xs: "fixed", md: "static" },
          bottom: 56,
          left: 0,
          right: 0,
          bgcolor: "white",
          p: 1.2,
          borderTop: "1px solid #eee",
          display: "flex",
          gap: 1.5,
          zIndex: 1200,
        }}
      >
        <Button
          variant="outlined"
          color="error"
          startIcon={isInWishlist ? <Favorite /> : <FavoriteBorder />}
          fullWidth
          onClick={handleWishlist}
        >
          {isInWishlist ? "Remove" : "Wishlist"}
        </Button>

        <Button
          variant="contained"
          color="secondary"
          startIcon={<ShoppingBag />}
          onClick={() => {
            if (product.sizes?.length && !selectedSize) {
              toast.error("Please select a size");
              return;
            }
            if (product.colors?.length && !selectedColor) {
              toast.error("Please select a color");
              return;
            }
            addToCart(product._id, 1, {
              size: selectedSize,
              color: selectedColor,
            });
            toast.success("Added to cart!");
          }}
          disabled={!inStock}
          fullWidth
        >
          {inStock ? "Add to Bag" : "Out of Stock"}
        </Button>
      </Box>

      {/* --- Product Details --- */}
      <Box sx={{ mt: 6 }}>
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{
            mb: 2,
            borderBottom: "2px solid #f50057",
            display: "inline-block",
            pb: 0.5,
          }}
        >
          Product Details
        </Typography>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              <strong>SKU:</strong> {product.sku || "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              <strong>Weight:</strong> {product.weight || "N/A"} kg
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">
              <strong>Dimensions:</strong>{" "}
              {product.dimensions?.length || 0} x {product.dimensions?.width || 0} x{" "}
              {product.dimensions?.height || 0} cm
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {/* --- Reviews --- */}
      <Box sx={{ mt: 6 }}>
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{
            mb: 2,
            borderBottom: "2px solid #f50057",
            display: "inline-block",
            pb: 0.5,
          }}
        >
          Reviews & Ratings
        </Typography>
        {product.reviews?.length ? (
          <Grid container spacing={2}>
            {product.reviews.map((rev) => (
              <Grid item xs={12} sm={6} key={rev._id}>
                <Card>
                  <CardContent sx={{ display: "flex", gap: 2 }}>
                    <Avatar>{rev.name[0].toUpperCase()}</Avatar>
                    <Box>
                      <Typography fontWeight="bold">{rev.name}</Typography>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <Rating value={rev.rating} size="small" readOnly />
                        <Typography variant="body2" color="text.secondary">
                          {rev.rating}/5
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {rev.comment}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography>No reviews yet.</Typography>
        )}

        {userInfo ? (
          <Box component="form" onSubmit={handleReviewSubmit} sx={{ mt: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Write a Review
            </Typography>
            <Rating
              value={rating}
              onChange={(e, newValue) => setRating(newValue)}
              precision={0.5}
              sx={{ my: 1 }}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Share your thoughts..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </Button>
          </Box>
        ) : (
          <Typography sx={{ mt: 2 }}>
            Please{" "}
            <Link to="/login" style={{ color: "#f50057", fontWeight: "bold" }}>
              log in
            </Link>{" "}
            to write a review.
          </Typography>
        )}
      </Box>

      {/* --- Related Products --- */}
      <Box sx={{ mt: 6, mb: 8 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          You May Also Like
        </Typography>
        <Grid container spacing={2}>
          {related.map((rp) => (
            <Grid item xs={6} sm={4} md={3} key={rp._id}>
              <Card component={Link} to={`/product/${rp._id}`}>
                <Box
                  sx={{
                    aspectRatio: "3/4",
                    bgcolor: "#f5f5f5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={
                      rp.imageUrl ||
                      "https://via.placeholder.com/300x400?text=No+Image"
                    }
                    alt={rp.name}
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                  />
                </Box>
                <CardContent>
                  <Typography variant="body2" noWrap>
                    {rp.name}
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    color="secondary"
                    fontWeight="bold"
                  >
                    ₹{rp.discountPrice || rp.price}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}
