import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/HomePage.jsx";
import Cart from "./pages/CartPage.jsx";
import Favourite from "./pages/FavouritePage.jsx";
import Product from "./pages/ProductPage.jsx";
import Profile from "./pages/ProfilePage.jsx";
import Login from "./pages/LoginPage.jsx";
import Register from "./pages/RegisterPage.jsx";
import Order from "./pages/OrderPage.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/products" element={<Product />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/orders" element={<Order />} />
            <Route path="/favourite" element={<Favourite />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
