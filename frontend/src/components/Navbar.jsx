import { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Box,
  Avatar,
  Menu,
  MenuItem,
  InputBase,
  Slide,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { ShoppingCart, Favorite, Search, Login } from "@mui/icons-material";
import { NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

// --- Search Bar ---
const SearchBar = styled("form")(({ theme }) => ({
  position: "relative",
  borderRadius: "8px",
  backgroundColor: "#f5f5f5",
  "&:hover": { backgroundColor: "#eaeaea" },
  marginLeft: theme.spacing(2),
  width: "100%",
  maxWidth: "250px",
  transition: "all 0.3s ease",
  "&:focus-within": { maxWidth: "400px" },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#777",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
  },
}));

// --- Custom NavLink Styling ---
const navLinkStyle = ({ isActive }) => ({
  textDecoration: "none",
  fontWeight: isActive ? "700" : "500",
  color: isActive ? "#f50057" : "inherit",
  borderBottom: isActive ? "2px solid #f50057" : "none",
  paddingBottom: "4px",
  transition: "all 0.2s ease-in-out",
});

export default function Navbar() {
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");
  const { cart } = useCart() || { cart: { items: [] } };
  const [anchorEl, setAnchorEl] = useState(null);
  const [elevate, setElevate] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const navigate = useNavigate();

  const handleProfileMenu = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    window.dispatchEvent(new Event("storage")); // 🔹 sync logout
    handleMenuClose();
    navigate("/");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setMobileSearchOpen(false);
    }
  };

  // Shadow only when scrolling
  useEffect(() => {
    const handleScroll = () => setElevate(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AppBar
      position="sticky"
      sx={{
        bgcolor: "white",
        color: "black",
        boxShadow: elevate ? "0px 2px 8px rgba(0,0,0,0.15)" : "none",
        transition: "box-shadow 0.3s ease-in-out",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", gap: { xs: 1, md: 2 } }}>
        {/* Logo */}
        <Typography
          component={NavLink}
          to="/"
          sx={{
            fontWeight: "bold",
            textDecoration: "none",
            color: "inherit",
            fontSize: { xs: "1rem", sm: "1.2rem", md: "1.5rem" },
            whiteSpace: "nowrap",
          }}
        >
          Fashion <Box component="span" sx={{ color: "#f50057" }}>Store</Box>
        </Typography>

        {/* Desktop Search */}
        <SearchBar
          onSubmit={handleSearchSubmit}
          sx={{ display: { xs: "none", md: "flex" } }}
        >
          <SearchIconWrapper>
            <Search />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search products…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchBar>

        {/* Nav Links + Icons */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 0.5, sm: 1.5, md: 2 },
            flexWrap: "nowrap",
            overflow: "hidden",
          }}
        >
          {/* Desktop Links */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
            <Typography component={NavLink} to="/" style={navLinkStyle}>
              Home
            </Typography>
            <Typography component={NavLink} to="/shop" style={navLinkStyle}>
              Shop
            </Typography>
          </Box>

          {/* Mobile Search Icon */}
          <IconButton
            color="inherit"
            sx={{ display: { xs: "flex", md: "none" } }}
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
          >
            <Search />
          </IconButton>

          {/* Wishlist */}
          {userInfo && (
            <IconButton
              color="inherit"
              component={NavLink}
              to="/wishlist"
              sx={{ display: { xs: "none", sm: "flex" } }}
            >
              <Favorite />
            </IconButton>
          )}

          {/* Cart */}
          <IconButton color="inherit" component={NavLink} to="/cart">
            <Badge badgeContent={cart?.items?.length || 0} color="error">
              <ShoppingCart />
            </Badge>
          </IconButton>

          {/* Profile / Auth */}
          {userInfo ? (
            <>
              <IconButton onClick={handleProfileMenu}>
                <Avatar
                  sx={{
                    bgcolor: "#f50057",
                    width: { xs: 28, sm: 32 },
                    height: { xs: 28, sm: 32 },
                    fontSize: { xs: "0.8rem", sm: "0.9rem" },
                  }}
                >
                  {userInfo.name[0].toUpperCase()}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem
                  onClick={() => {
                    navigate("/profile");
                    handleMenuClose();
                  }}
                >
                  Profile
                </MenuItem>

                {/* ✅ FIX: no Fragment, use array of MenuItems */}
                {userInfo?.isAdmin && [
                  <MenuItem
                    key="admin-orders"
                    onClick={() => {
                      navigate("/admin/orders");
                      handleMenuClose();
                    }}
                  >
                    Admin Orders
                  </MenuItem>,
                  <MenuItem
                    key="admin-products"
                    onClick={() => {
                      navigate("/admin/products");
                      handleMenuClose();
                    }}
                  >
                    Admin Products
                  </MenuItem>,
                ]}

                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              {/* Desktop Auth Links */}
              <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
                <Typography component={NavLink} to="/login" style={navLinkStyle}>
                  Login
                </Typography>
                <Typography component={NavLink} to="/register" style={navLinkStyle}>
                  Register
                </Typography>
              </Box>
              {/* Mobile Auth Icon */}
              <IconButton
                sx={{ display: { xs: "flex", md: "none" } }}
                component={NavLink}
                to="/login"
                color="inherit"
              >
                <Login />
              </IconButton>
            </>
          )}
        </Box>
      </Toolbar>

      {/* Mobile Full-width Search */}
      <Slide direction="down" in={mobileSearchOpen} mountOnEnter unmountOnExit>
        <Box
          component="form"
          onSubmit={handleSearchSubmit}
          sx={{
            px: 2,
            py: 1,
            bgcolor: "#f5f5f5",
            display: { xs: "flex", md: "none" },
          }}
        >
          <InputBase
            fullWidth
            autoFocus
            placeholder="Search products…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Box>
      </Slide>
    </AppBar>
  );
}
