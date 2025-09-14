import { Link, useLocation } from "react-router-dom";
import { Home, ShoppingBag, Heart, User } from "lucide-react";

const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    { to: "/", label: "Home", icon: Home },
    { to: "/shop", label: "Shop", icon: ShoppingBag },
    { to: "/wishlist", label: "Wishlist", icon: Heart },
    { to: "/profile", label: "Profile", icon: User },
  ];

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-md flex justify-around py-2 z-50">
      {navItems.map(({ to, label, icon: Icon }) => {
        const isActive = location.pathname === to;
        return (
          <Link
            key={to}
            to={to}
            className={`flex flex-col items-center text-xs ${
              isActive ? "text-accent" : "text-gray-500 hover:text-accent"
            }`}
          >
            <Icon size={18} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNav;
