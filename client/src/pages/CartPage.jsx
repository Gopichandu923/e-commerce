import React, { useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCartItems, updateCartItem, removeCartItem, clearCart } from "../redux/cart/cartSlice";
import { getUserFromCookie } from "../utils/cookie.js";

const Cart = ({ darkMode = false }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { cartItems, loading, error } = useSelector((state) => state.cart);
  const currentUser = useMemo(() => getUserFromCookie(), []);
  const token = currentUser?.token;

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.priceAtAddition * item.quantity, 0);
  }, [cartItems]);

  useEffect(() => {
    dispatch(getCartItems());
  }, [dispatch]);

  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    dispatch(updateCartItem(itemId, newQuantity));
  };

  const handleRemoveItem = (itemId) => {
    dispatch(removeCartItem(itemId));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div className="space-y-2">
          <span className="text-secondary font-label text-xs tracking-[0.2em] uppercase">
            Your Selection
          </span>
          <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tighter text-primary">
            Shopping Cart
          </h1>
        </div>
        {cartItems.length > 0 && (
          <button
            onClick={handleClearCart}
            disabled={loading}
            className={`px-4 py-2 rounded-lg font-label text-xs tracking-widest uppercase transition-colors mt-4 sm:mt-0 ${
              loading
                ? "bg-[#e4e2e3] text-[#44474c] cursor-not-allowed"
                : "bg-[#f5f3f4] hover:bg-[#e4e2e3] text-[#ba1a1a]"
            }`}
          >
            Clear Cart
          </button>
        )}
      </div>

      {error && (
        <div className="bg-[#ffdad6] border border-[#ba1a1a] text-[#93000a] px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#735c00] mb-4"></div>
          <p className="text-[#44474c] font-body">Loading your cart...</p>
        </div>
      ) : cartItems.length === 0 ? (
        <div className="bg-[#f5f3f4] rounded-xl p-12 text-center">
          <h2 className="text-2xl font-headline font-bold text-[#041627] mb-3">
            Your cart is empty
          </h2>
          <p className="text-[#44474c] font-body mb-8">
            {token
              ? "Start shopping to add items to your cart"
              : "Sign in to save your cart"}
          </p>
          {token ? (
            <Link
              to="/"
              className="btn-gradient px-6 py-3 rounded-lg text-white font-label text-sm tracking-widest uppercase hover:opacity-90 transition-opacity"
            >
              Continue Shopping
            </Link>
          ) : (
            <Link
              to="/login"
              className="btn-gradient px-6 py-3 rounded-lg text-white font-label text-sm tracking-widest uppercase hover:opacity-90 transition-opacity"
            >
              Sign In
            </Link>
          )}
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex flex-col sm:flex-row items-start bg-[#ffffff] rounded-xl p-4 mb-4 hover:shadow-md transition-shadow"
              >
                <img
                  src={
                    item.productId?.image ||
                    "https://via.placeholder.com/120?text=Product"
                  }
                  alt={item.productId?.name || "Product"}
                  className="w-full sm:w-28 h-28 object-cover rounded-lg mb-3 sm:mb-0 sm:mr-4"
                />
                <div className="flex-1 w-full">
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <div className="mb-3 sm:mb-0">
                      <h3 className="font-headline font-bold text-lg text-[#041627]">
                        {item.productId?.name || "Product"}
                      </h3>
                      <p className="text-[#44474c] font-label text-sm mt-1">
                        ${item.priceAtAddition.toFixed(2)} × {item.quantity}
                      </p>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(item._id)}
                      disabled={loading}
                      className={`px-3 py-1.5 text-sm font-label rounded-lg transition-colors ${
                        loading
                          ? "bg-[#e4e2e3] text-[#44474c] cursor-not-allowed"
                          : "bg-[#f5f3f4] hover:bg-[#ffdad6] text-[#ba1a1a]"
                      }`}
                    >
                      Remove
                    </button>
                  </div>

                  <div className="flex items-center mt-4">
                    <button
                      onClick={() =>
                        handleUpdateQuantity(item._id, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1 || loading}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        item.quantity <= 1 || loading
                          ? "bg-[#e4e2e3] text-[#44474c] cursor-not-allowed"
                          : "bg-[#f5f3f4] hover:bg-[#e4e2e3] text-[#041627]"
                      }`}
                    >
                      <span className="material-symbols-outlined text-lg">remove</span>
                    </button>

                    <input
                      type="number"
                      value={item.quantity}
                      min="1"
                      className="w-14 h-8 mx-3 border-0 bg-transparent text-center font-label text-[#041627]"
                      onChange={(e) => {
                        const newQuantity = parseInt(e.target.value);
                        if (!isNaN(newQuantity)) {
                          handleUpdateQuantity(item._id, newQuantity);
                        }
                      }}
                      disabled={loading}
                    />

                    <button
                      onClick={() =>
                        handleUpdateQuantity(item._id, item.quantity + 1)
                      }
                      disabled={loading}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        loading
                          ? "bg-[#e4e2e3] text-[#44474c] cursor-not-allowed"
                          : "bg-[#f5f3f4] hover:bg-[#e4e2e3] text-[#041627]"
                      }`}
                    >
                      <span className="material-symbols-outlined text-lg">add</span>
                    </button>
                    
                    <span className="ml-auto font-headline font-bold text-lg text-[#041627]">
                      ${(item.priceAtAddition * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:w-80">
            <div className="bg-[#ffffff] rounded-xl p-6 sticky top-24">
              <h2 className="text-xl font-headline font-bold text-[#041627] mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-[#44474c] font-body">Subtotal</span>
                  <span className="font-medium text-[#041627]">${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#44474c] font-body">Shipping</span>
                  <span className="text-[#44474c] font-body">Calculated at checkout</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#44474c] font-body">Tax</span>
                  <span className="text-[#44474c] font-body">Calculated at checkout</span>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-[#f5f3f4]">
                <span className="text-lg font-headline font-bold text-[#041627]">Estimated Total</span>
                <span className="text-lg font-headline font-bold text-[#041627]">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="w-full mt-6 py-3 btn-gradient text-white font-label text-sm tracking-widest uppercase rounded-lg hover:opacity-90 transition-opacity"
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