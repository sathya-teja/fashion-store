import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import BottomNav from "./components/BottomNav";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetails from "./pages/ProductDetails";
import { CartProvider } from "./context/CartContext";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import AdminOrders from "./pages/AdminOrders";
import AdminProducts from "./pages/AdminProducts";
import Profile from "./pages/Profile";
import WishlistPage from "./pages/WishlistPage";
import MockPayment from "./pages/MockPayment";
import OrderConfirmation from "./pages/OrderConfirmation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { WishlistProvider } from "./context/WishlistContext";




function App() {
  return (
    <BrowserRouter>
    <WishlistProvider>
      <CartProvider>
        {/* ✅ Navbar always on top */}
        <Navbar />

        {/* ✅ Toast notifications */}
        <ToastContainer position="top-right" autoClose={2000} />

        {/* ✅ Main content wrapper */}
        <div className="pt-3 px-0 md:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/mock-payment" element={<MockPayment totalAmount={999} />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
          </Routes>
        </div>

        {/* ✅ Global Footer */}
        {/* <Footer /> */}

        {/* ✅ Global Bottom Navigation (mobile only) */}
        <BottomNav />
      </CartProvider>
      </WishlistProvider>
    </BrowserRouter>
  );
}

export default App;
