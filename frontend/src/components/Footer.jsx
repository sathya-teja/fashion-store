import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-primary text-white pt-10 pb-6 mt-16">
  <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center sm:text-left">
    {/* Brand */}
    <div>
      <h2 className="text-xl font-bold mb-3">Fashion Store</h2>
      <p className="text-sm text-gray-300">Your one-stop shop for trendy outfits and timeless classics.</p>
    </div>

    {/* Quick Links */}
    <div>
      <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
      <ul className="space-y-2 text-sm">
        <li><Link to="/" className="hover:text-accent transition">Home</Link></li>
        <li><Link to="/shop" className="hover:text-accent transition">Shop</Link></li>
        <li><Link to="/cart" className="hover:text-accent transition">Cart</Link></li>
        <li><Link to="/wishlist" className="hover:text-accent transition">Wishlist</Link></li>
      </ul>
    </div>

    {/* Customer Support */}
    <div>
      <h3 className="text-lg font-semibold mb-3">Customer Support</h3>
      <ul className="space-y-2 text-sm">
        <li><Link to="/profile" className="hover:text-accent transition">My Account</Link></li>
        <li><Link to="/orders" className="hover:text-accent transition">Order Tracking</Link></li>
        <li><Link to="/contact" className="hover:text-accent transition">Contact Us</Link></li>
        <li><Link to="/faq" className="hover:text-accent transition">FAQ</Link></li>
      </ul>
    </div>

    {/* Newsletter */}
    <div>
      <h3 className="text-lg font-semibold mb-3">Stay Updated</h3>
      <p className="text-sm mb-3 text-gray-300">Subscribe to get offers, giveaways, and updates.</p>
      <form className="flex flex-col sm:flex-row">
        <input type="email" placeholder="Enter your email" className="w-full px-3 py-2 rounded sm:rounded-l text-gray-900 text-sm focus:outline-none"/>
        <button type="submit" className="bg-accent px-4 py-2 rounded sm:rounded-r mt-2 sm:mt-0 text-white text-sm hover:bg-accent/80 transition">Subscribe</button>
      </form>
    </div>
  </div>

  {/* Bottom bar */}
  <div className="mt-10 border-t border-white/20 pt-4 text-center text-sm text-gray-300">
    <p>© {new Date().getFullYear()} Fashion Store. All rights reserved.</p>
  </div>
</footer>

  );
}
