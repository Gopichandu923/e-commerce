import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.js";
import Cart from "./pages/Cart.js";
import Product from "./pages/Product.js";
import Profile from "./pages/Profile.js";
import Login from "./pages/Login.js";
import Register from "./pages/Register";
import Order from "./pages/Order.js";
import Header from "./components/Header.js";
import Footer from "./components/Footer.js";

import "./App.css";
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
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
