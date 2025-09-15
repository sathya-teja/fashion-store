// Cart.jsx (Updated Professional UI)
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Paper,
  IconButton,
  Button,
  Divider,
  CircularProgress,
  Avatar,
  TextField,
  Chip,
} from "@mui/material";
import { Add, Remove, Delete, LocalOffer } from "@mui/icons-material";
import axios from "axios";
import { toast } from "react-toastify";

export default function Cart() {
  const { cart, fetchCart, removeFromCart, updateQuantity, initialLoading } =
    useCart();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState("");
  const [loadingCoupon, setLoadingCoupon] = useState(false);

  // ✅ Fetch cart once on mount if user is logged in
  useEffect(() => {
    if (userInfo) fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo]);

  if (!userInfo)
    return (
      <Typography align="center" sx={{ mt: 6, color: "text.secondary" }}>
        Please log in to view your cart.
      </Typography>
    );

  if (initialLoading)
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <CircularProgress />
      </Box>
    );

  if (!cart || !cart.items?.length)
    return (
      <Typography align="center" sx={{ mt: 6, color: "text.secondary" }}>
        Your cart is empty 🛒
      </Typography>
    );

  const total = cart.total ?? 0;
  const subtotal = cart.subtotal ?? 0;
  const discount =
    subtotal && total && subtotal > total ? subtotal - total : 0;

  // ✅ Apply Coupon
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return toast.error("Enter a coupon code");
    try {
      setLoadingCoupon(true);
      await axios.post(
        "http://localhost:5000/api/cart/apply-coupon",
        { code: couponCode },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      toast.success("Coupon applied!");
      setCouponCode("");
      fetchCart(); // fetch only once after applying coupon
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid coupon");
    } finally {
      setLoadingCoupon(false);
    }
  };

  // ✅ Remove Coupon
  const handleRemoveCoupon = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/cart/remove-coupon",
        {},
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      toast.info("Coupon removed");
      fetchCart();
    } catch (err) {
      toast.error("Failed to remove coupon");
    }
  };

  return (
    <Box sx={{ maxWidth: "1200px", mx: "auto", p: { xs: 2, md: 4 }, mt: 2 }} >
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Shopping Bag ({cart.items.length} items)
      </Typography>

      <Grid container spacing={3}>
        {/* Cart Items */}
        <Grid item xs={12} md={8}>
          {cart.items.map((item) => (
            <Paper
              key={item._id}
              sx={{
                p: 2,
                mb: 2,
                display: "flex",
                gap: 2,
                border: "1px solid #eee",
                borderRadius: 2,
              }}
            >
              <Avatar
                variant="rounded"
                src={item.product.imageUrl}
                alt={item.product.name}
                sx={{
                  width: { xs: 90, sm: 110 },
                  height: { xs: 120, sm: 140 },
                  flexShrink: 0,
                  bgcolor: "#f9f9f9",
                }}
              />

              <Box flex={1}>
                <Typography fontWeight="bold" fontSize="1rem" noWrap>
                  {item.product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={1}>
                  ₹{item.product.price} each
                </Typography>

                {/* Size & Color */}
                <Box display="flex" gap={1} mb={1}>
                  {item.selectedSize && (
                    <Chip label={`Size: ${item.selectedSize}`} size="small" />
                  )}
                  {item.selectedColor && (
                    <Chip label={`Color: ${item.selectedColor}`} size="small" />
                  )}
                </Box>

                {/* Quantity + Price */}
                <Box
                  mt={1}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      border: "1px solid #ddd",
                      borderRadius: "20px",
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={() =>
                        item.quantity > 1 &&
                        updateQuantity(item._id, item.quantity - 1)
                      }
                    >
                      <Remove fontSize="small" />
                    </IconButton>
                    <Typography sx={{ px: 2 }}>{item.quantity}</Typography>
                    <IconButton
                      size="small"
                      onClick={() =>
                        updateQuantity(item._id, item.quantity + 1)
                      }
                    >
                      <Add fontSize="small" />
                    </IconButton>
                  </Box>

                  <Typography fontWeight="bold" color="text.primary">
                    ₹{item.product.price * item.quantity}
                  </Typography>
                </Box>

                {/* Remove */}
                <Box mt={1}>
                  <Button
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => removeFromCart(item._id)}
                    size="small"
                  >
                    Remove
                  </Button>
                </Box>
              </Box>
            </Paper>
          ))}
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              position: "sticky",
              top: 80,
              borderRadius: 2,
              boxShadow: "0px 4px 12px rgba(0,0,0,0.05)",
            }}
          >
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Price Details
            </Typography>

            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography>Total MRP</Typography>
              <Typography>₹{subtotal}</Typography>
            </Box>

            {discount > 0 && (
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography>Discount</Typography>
                <Typography color="success.main">-₹{discount}</Typography>
              </Box>
            )}

            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography>Shipping Fee</Typography>
              <Typography color="success.main">Free</Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box
              display="flex"
              justifyContent="space-between"
              fontWeight="bold"
              mb={2}
            >
              <Typography>Total Amount</Typography>
              <Typography>₹{total}</Typography>
            </Box>

            {/* Coupon input */}
            {!cart.coupon?.code ? (
              <Box
                display="flex"
                gap={1}
                mb={2}
                sx={{ bgcolor: "#fafafa", p: 1.5, borderRadius: 1 }}
              >
                <LocalOffer color="action" />
                <TextField
                  size="small"
                  fullWidth
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <Button
                  variant="contained"
                  color="primary"
                  disabled={loadingCoupon}
                  onClick={handleApplyCoupon}
                >
                  {loadingCoupon ? "..." : "Apply"}
                </Button>
              </Box>
            ) : (
              <Box
                mb={2}
                p={1.5}
                sx={{
                  bgcolor: "#f5f5f5",
                  borderRadius: 1,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography>
                  Applied Coupon: <b>{cart.coupon.code}</b>
                </Typography>
                <Button size="small" color="error" onClick={handleRemoveCoupon}>
                  Remove
                </Button>
              </Box>
            )}

            {discount > 0 && (
              <Typography color="success.main" variant="body2" mb={2}>
                You saved ₹{discount} on this order 🎉
              </Typography>
            )}

            <Button
              fullWidth
              variant="contained"
              color="secondary"
              onClick={() => navigate("/checkout")}
              sx={{ mt: 1 }}
            >
              Place Order
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* ✅ Mobile Fixed Checkout Bar */}
      <Box
        sx={{
          display: { xs: "block", md: "none" },
          position: "fixed",
          bottom: 60,
          left: 0,
          right: 0,
          bgcolor: "white",
          borderTop: "1px solid #eee",
          p: 2,
          boxShadow: "0 -2px 6px rgba(0,0,0,0.05)",
        }}
      >
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography fontWeight="bold">Total</Typography>
          <Typography fontWeight="bold">₹{total}</Typography>
        </Box>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={() => navigate("/checkout")}
        >
          Place Order
        </Button>
      </Box>
    </Box>
  );
}
