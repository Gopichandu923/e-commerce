// src/components/Cart.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [subtotal, setSubtotal] = useState(0);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("http://localhost:4040/api/cart", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch cart items");
      }

      const data = await response.json();
      setCartItems(data);
      calculateSubtotal(data);
    } catch (err) {
      setError(err.message || "Error loading cart");
    } finally {
      setLoading(false);
    }
  };

  const calculateSubtotal = (items) => {
    const total = items.reduce(
      (sum, item) => sum + item.priceAtAddition * item.quantity,
      0
    );
    setSubtotal(total);
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      setLoading(true);
      setError("");
      const response = await fetch(`http://localhost:4040/api/cart/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (!response.ok) {
        throw new Error("Failed to update quantity");
      }

      await fetchCart();
      setSuccessMessage("Cart updated successfully");
      setTimeout(() => setSuccessMessage(""), 2000);
    } catch (err) {
      setError(err.message || "Error updating item");
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId) => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`http://localhost:4040/api/cart/${itemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to remove item");
      }

      await fetchCart();
      setSuccessMessage("Item removed successfully");
      setTimeout(() => setSuccessMessage(""), 2000);
    } catch (err) {
      setError(err.message || "Error removing item");
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("http://localhost:4040/api/cart", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to clear cart");
      }

      await fetchCart();
      setSuccessMessage("Cart cleared successfully");
      setTimeout(() => setSuccessMessage(""), 2000);
    } catch (err) {
      setError(err.message || "Error clearing cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Your Shopping Cart
        </h1>
        {cartItems.length > 0 && (
          <button
            onClick={clearCart}
            disabled={loading}
            className={`px-4 py-2 rounded-md font-medium ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600 text-white"
            } transition-colors mt-2 sm:mt-0`}
          >
            Clear Cart
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p>Loading your cart...</p>
        </div>
      ) : cartItems.length === 0 ? (
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-6">
            Start shopping to add items to your cart
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Cart Items */}
          <div className="flex-1">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex flex-col sm:flex-row items-start sm:items-center border border-gray-200 rounded-lg p-4 mb-4 bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <img
                  src={
                    item.productId?.image ||
                    "https://via.placeholder.com/120?text=Product"
                  }
                  alt={item.productId?.name || "Product"}
                  className="w-full sm:w-24 h-24 object-cover rounded-lg mb-3 sm:mb-0 sm:mr-4"
                />
                <div className="flex-1 w-full">
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <div className="mb-3 sm:mb-0">
                      <h3 className="font-bold text-gray-800 text-lg">
                        {item.productId?.name || "Product"}
                      </h3>
                      <p className="text-gray-600">
                        ${item.priceAtAddition.toFixed(2)} × {item.quantity} ={" "}
                        <span className="font-semibold">
                          ${(item.priceAtAddition * item.quantity).toFixed(2)}
                        </span>
                      </p>
                    </div>

                    <button
                      onClick={() => removeItem(item._id)}
                      disabled={loading}
                      className={`px-3 py-1.5 text-sm font-medium rounded ${
                        loading
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-red-500 hover:bg-red-600 text-white"
                      } transition-colors`}
                    >
                      Remove
                    </button>
                  </div>

                  <div className="flex items-center mt-3">
                    <button
                      onClick={() =>
                        updateQuantity(item._id, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1 || loading}
                      className={`w-8 h-8 rounded-md flex items-center justify-center ${
                        item.quantity <= 1 || loading
                          ? "bg-gray-200 cursor-not-allowed"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                    >
                      -
                    </button>

                    <input
                      type="number"
                      value={item.quantity}
                      min="1"
                      className="w-14 h-8 mx-2 border border-gray-300 rounded text-center"
                      onChange={(e) => {
                        const newQuantity = parseInt(e.target.value);
                        if (!isNaN(newQuantity)) {
                          updateQuantity(item._id, newQuantity);
                        }
                      }}
                      disabled={loading}
                    />

                    <button
                      onClick={() =>
                        updateQuantity(item._id, item.quantity + 1)
                      }
                      disabled={loading}
                      className={`w-8 h-8 rounded-md flex items-center justify-center ${
                        loading
                          ? "bg-gray-200 cursor-not-allowed"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:w-80">
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm sticky top-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-600">Calculated at checkout</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-600">Calculated at checkout</span>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-gray-200">
                <span className="text-lg font-bold">Estimated Total</span>
                <span className="text-lg font-bold">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="w-full mt-6 py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
