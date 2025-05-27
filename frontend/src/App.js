import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.js";
import Cart from "./pages/Cart.js";
import Product from "./pages/Product.js";
import Profile from "./pages/Profile.js";
import Login from "./pages/Login.js";
import Register from "./pages/Register";
import Order from "./pages/Order.js";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/products" element={<Product />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/orders" element={<Order />} />
      </Routes>
    </Router>
  );
};

export default App;
