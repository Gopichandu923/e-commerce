import React, { useState, useEffect, useMemo } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import Home from "./pages/HomePage.jsx";
import Cart from "./pages/CartPage.jsx";
import Favourite from "./pages/FavouritePage.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Profile from "./pages/ProfilePage.jsx";
import Login from "./pages/LoginPage.jsx";
import Register from "./pages/RegisterPage.jsx";
import Order from "./pages/OrderPage.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import ShopPage from "./pages/shoppingPage.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import AddProductPage from "./pages/AddProductPage.jsx";

const App = () => {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("darkMode") === "true";
    }
    return false;
  });

  const { cartItems } = useSelector((state) => state.cart);
  const cartCount = useMemo(() => cartItems.reduce((sum, item) => sum + item.quantity, 0), [cartItems]);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <Router>
      <div className={`app-container ${darkMode ? "dark" : ""} w-full overflow-x-hidden`}>
        <Header darkMode={darkMode} setDarkMode={setDarkMode} cartCount={cartCount} />
        <main className="main-content pt-20 pb-12 w-full">
          <Routes>
            <Route path="/" element={<Home darkMode={darkMode} />} />
            <Route path="/cart" element={<Cart darkMode={darkMode} />} />
            <Route path="/product/:productId" element={<ProductDetails darkMode={darkMode} />} />
            <Route path="/profile" element={<Profile darkMode={darkMode} />} />
            <Route path="/login" element={<Login darkMode={darkMode} />} />
            <Route path="/register" element={<Register darkMode={darkMode} />} />
            <Route path="/orders" element={<Order darkMode={darkMode} />} />
            <Route path="/orders/:orderId" element={<Order darkMode={darkMode} />} />
            <Route path="/favourite" element={<Favourite darkMode={darkMode} />} />
            <Route path="/shop" element={<ShopPage darkMode={darkMode} />} />
            <Route path="/shop/:categoryName" element={<ShopPage darkMode={darkMode} />} />
            <Route path="/search" element={<SearchPage darkMode={darkMode} />} />
            <Route path="/checkout" element={<CheckoutPage darkMode={darkMode} />} />
            <Route path="/add-product" element={<AddProductPage darkMode={darkMode} />} />
          </Routes>
        </main>
        <Footer darkMode={darkMode} />
      </div>
    </Router>
  );
};

export default App;
