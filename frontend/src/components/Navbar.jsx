import { NavLink } from "react-router-dom";

export default function Navbar() {
  const linkClass = ({ isActive }) =>
    isActive ? "text-yellow-400 font-semibold" : "text-white";

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">Fashion Store</h1>
      <ul className="flex space-x-6">
        <li>
          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/shop" className={linkClass}>
            Shop
          </NavLink>
        </li>
        <li>
          <NavLink to="/cart" className={linkClass}>
            Cart
          </NavLink>
        </li>
        <li>
          <NavLink to="/login" className={linkClass}>
            Login
          </NavLink>
        </li>
        <li>
          <NavLink to="/register" className={linkClass}>
            Register
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
