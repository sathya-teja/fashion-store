import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter, FaPinterestP } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6 mt-16">
      <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-center sm:text-left">
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-3">Fashion Store</h2>
          <p className="text-sm leading-relaxed">
            Your one-stop shop for trendy outfits and timeless classics. 
            Stay stylish, stay confident. ✨
          </p>

          {/* Social Icons */}
          <div className="flex justify-center sm:justify-start gap-4 mt-4">
            <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 hover:bg-accent transition">
              <FaFacebookF size={14} />
            </a>
            <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 hover:bg-accent transition">
              <FaInstagram size={14} />
            </a>
            <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 hover:bg-accent transition">
              <FaTwitter size={14} />
            </a>
            <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 hover:bg-accent transition">
              <FaPinterestP size={14} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-accent transition">Home</Link></li>
            <li><Link to="/shop" className="hover:text-accent transition">Shop</Link></li>
            <li><Link to="/cart" className="hover:text-accent transition">Cart</Link></li>
            <li><Link to="/wishlist" className="hover:text-accent transition">Wishlist</Link></li>
          </ul>
        </div>

        {/* Customer Support */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Customer Support</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/profile" className="hover:text-accent transition">My Account</Link></li>
            <li><Link to="/orders" className="hover:text-accent transition">Order Tracking</Link></li>
            <li><Link to="/contact" className="hover:text-accent transition">Contact Us</Link></li>
            <li><Link to="/faq" className="hover:text-accent transition">FAQ</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Stay Updated</h3>
          <p className="text-sm mb-4 text-gray-400">
            Subscribe to get offers, giveaways, and updates straight to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 rounded sm:rounded-l text-gray-900 text-sm focus:outline-none"
            />
            <button
              type="submit"
              className="bg-accent px-4 py-2 rounded sm:rounded-r mt-2 sm:mt-0 text-white text-sm hover:bg-accent/80 transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-10 border-t border-gray-700 pt-4 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Fashion Store. All rights reserved.</p>
      </div>
    </footer>
  );
}
