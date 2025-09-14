import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { cart } = useCart() || { cart: { items: [] } };

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    window.location.href = "/";
  };

  const linkClass = ({ isActive }) =>
    isActive
      ? "text-accent font-semibold transition"
      : "text-gray-200 hover:text-white transition";

  return (
    <nav className="bg-primary shadow-md px-4 md:px-6 py-4 flex justify-between items-center relative">
      {/* Logo */}
      <h1 className="text-xl md:text-2xl font-bold text-white tracking-wide">
        Fashion <span className="text-accent">Store</span>
      </h1>

      {/* Desktop Links */}
      <ul className="hidden md:flex space-x-6 items-center">
        <li>
          <NavLink to="/" className={linkClass}>Home</NavLink>
        </li>
        <li>
          <NavLink to="/shop" className={linkClass}>Shop</NavLink>
        </li>
        <li className="relative">
          <NavLink to="/cart" className={linkClass}>Cart</NavLink>
          {cart?.items?.length > 0 && (
            <span className="absolute -top-2 -right-3 bg-accent text-white text-xs font-bold rounded-full px-2 shadow">
              {cart.items.length}
            </span>
          )}
        </li>

        {userInfo && (
          <li>
            <NavLink to="/wishlist" className={linkClass}>Wishlist</NavLink>
          </li>
        )}

        {/* User Dropdown */}
        {userInfo ? (
          <li className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-1 text-accent font-semibold hover:text-white transition"
            >
              <span>{userInfo.name}</span>
              <svg
                className={`w-4 h-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
              </svg>
            </button>

            {dropdownOpen && (
              <ul className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50">
                <li>
                  <NavLink to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition" onClick={() => setDropdownOpen(false)}>Profile</NavLink>
                </li>
                {userInfo?.isAdmin && (
                  <>
                    <li>
                      <NavLink to="/admin/orders" className="block px-4 py-2 text-primary hover:bg-gray-100 transition" onClick={() => setDropdownOpen(false)}>Admin Orders</NavLink>
                    </li>
                    <li>
                      <NavLink to="/admin/products" className="block px-4 py-2 text-primary hover:bg-gray-100 transition" onClick={() => setDropdownOpen(false)}>Admin Products</NavLink>
                    </li>
                  </>
                )}
                <li>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 transition">Logout</button>
                </li>
              </ul>
            )}
          </li>
        ) : (
          <>
            <li><NavLink to="/login" className={linkClass}>Login</NavLink></li>
            <li><NavLink to="/register" className={linkClass}>Register</NavLink></li>
          </>
        )}
      </ul>

      {/* Mobile Menu Button */}
      <button className="md:hidden text-white" onClick={() => setMobileOpen(!mobileOpen)}>
        {mobileOpen ? <X size={24}/> : <Menu size={24}/>}
      </button>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="absolute top-full left-0 w-full bg-primary text-white flex flex-col py-4 px-6 space-y-3 md:hidden shadow-lg z-40">
          <NavLink to="/" className={linkClass} onClick={() => setMobileOpen(false)}>Home</NavLink>
          <NavLink to="/shop" className={linkClass} onClick={() => setMobileOpen(false)}>Shop</NavLink>
          <NavLink to="/cart" className={linkClass} onClick={() => setMobileOpen(false)}>Cart</NavLink>
          {userInfo && <NavLink to="/wishlist" className={linkClass} onClick={() => setMobileOpen(false)}>Wishlist</NavLink>}
          {userInfo ? (
            <>
              <NavLink to="/profile" className={linkClass} onClick={() => setMobileOpen(false)}>Profile</NavLink>
              {userInfo?.isAdmin && (
                <>
                  <NavLink to="/admin/orders" className={linkClass} onClick={() => setMobileOpen(false)}>Admin Orders</NavLink>
                  <NavLink to="/admin/products" className={linkClass} onClick={() => setMobileOpen(false)}>Admin Products</NavLink>
                </>
              )}
              <button onClick={handleLogout} className="text-red-400 text-left">Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass} onClick={() => setMobileOpen(false)}>Login</NavLink>
              <NavLink to="/register" className={linkClass} onClick={() => setMobileOpen(false)}>Register</NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
