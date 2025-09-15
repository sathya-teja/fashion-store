import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
} from "@mui/material";
import { Home, ShoppingBag, Heart, User } from "lucide-react";

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const [value, setValue] = useState(0);

  const navItems = [
    { to: "/", label: "Home", icon: <Home size={20} /> },
    { to: "/shop", label: "Shop", icon: <ShoppingBag size={20} /> },
    { to: "/wishlist", label: "Wishlist", icon: <Heart size={20} /> },
    { to: "/profile", label: "Profile", icon: <User size={20} /> },
  ];

  // Sync active tab with current path
  useEffect(() => {
    const activeIndex = navItems.findIndex((item) => item.to === location.pathname);
    setValue(activeIndex === -1 ? 0 : activeIndex);
  }, [location.pathname]);

  return (
    <Paper
  sx={{
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1200,
    display: { xs: "block", md: "none" }, // ✅ only show on small screens
  }}
  elevation={3}
>
  <BottomNavigation
    value={value}
    onChange={(event, newValue) => {
      setValue(newValue);
      navigate(navItems[newValue].to);
    }}
    sx={{
      "& .Mui-selected": {
        color: "#f50057", // accent color
      },
    }}
    showLabels
  >
    {navItems.map((item, index) => (
      <BottomNavigationAction
        key={index}
        label={item.label}
        icon={item.icon}
      />
    ))}
  </BottomNavigation>
</Paper>

  );
}
