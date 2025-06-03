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

  const styles = {
    container: { padding: "20px", maxWidth: "1000px", margin: "0 auto" },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px",
    },
    title: { fontSize: "24px", fontWeight: "bold" },
    clearBtn: {
      background: "#ff4d4f",
      color: "#fff",
      border: "none",
      padding: "10px 15px",
      borderRadius: "5px",
      cursor: "pointer",
    },
    errorMessage: {
      background: "#ffcccc",
      color: "#b30000",
      padding: "10px",
      marginBottom: "10px",
      borderRadius: "5px",
    },
    successMessage: {
      background: "#d4edda",
      color: "#155724",
      padding: "10px",
      marginBottom: "10px",
      borderRadius: "5px",
    },
    emptyCart: {
      textAlign: "center",
      padding: "40px",
      border: "1px dashed #ccc",
      borderRadius: "10px",
    },
    continueBtn: {
      marginTop: "20px",
      background: "#1890ff",
      color: "#fff",
      border: "none",
      padding: "10px 20px",
      borderRadius: "5px",
      cursor: "pointer",
    },
    cartContainer: { display: "flex", gap: "20px", flexWrap: "wrap" },
    cartItem: {
      display: "flex",
      alignItems: "center",
      padding: "10px",
      border: "1px solid #ccc",
      borderRadius: "10px",
      marginBottom: "10px",
      width: "100%",
      background: "#f9f9f9",
    },
    itemImage: {
      width: "120px",
      height: "120px",
      objectFit: "cover",
      marginRight: "20px",
      borderRadius: "5px",
    },
    itemDetails: { flex: "1" },
    itemName: { fontSize: "18px", fontWeight: "bold", marginBottom: "5px" },
    itemPrice: { fontSize: "16px", marginBottom: "10px" },
    quantityControl: { display: "flex", alignItems: "center", gap: "5px" },
    quantityBtn: {
      background: "#ddd",
      border: "none",
      padding: "5px 10px",
      cursor: "pointer",
      fontSize: "16px",
      borderRadius: "4px",
    },
    quantityInput: {
      width: "50px",
      textAlign: "center",
      padding: "5px",
      border: "1px solid #ccc",
      borderRadius: "4px",
    },
    removeBtn: {
      background: "#ff4d4f",
      color: "#fff",
      border: "none",
      padding: "8px 15px",
      cursor: "pointer",
      borderRadius: "5px",
      fontWeight: "500",
    },
    summaryCard: {
      flex: "1",
      border: "1px solid #ccc",
      borderRadius: "10px",
      padding: "20px",
      background: "#f9f9f9",
      minWidth: "250px",
    },
    summaryRow: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "10px",
      paddingBottom: "5px",
      borderBottom: "1px solid #eee",
    },
    totalRow: {
      display: "flex",
      justifyContent: "space-between",
      fontWeight: "bold",
      fontSize: "18px",
      marginTop: "20px",
      paddingTop: "10px",
      borderTop: "2px solid #ddd",
    },
    checkoutBtn: {
      background: "#52c41a",
      color: "#fff",
      border: "none",
      padding: "10px 20px",
      width: "100%",
      borderRadius: "5px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "16px",
      marginTop: "15px",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Your Shopping Cart</h1>
        {cartItems.length > 0 && (
          <button
            style={styles.clearBtn}
            onClick={clearCart}
            disabled={loading}
          >
            Clear Cart
          </button>
        )}
      </div>

      {error && <div style={styles.errorMessage}>{error}</div>}
      {successMessage && (
        <div style={styles.successMessage}>{successMessage}</div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p>Loading your cart...</p>
        </div>
      ) : cartItems.length === 0 ? (
        <div style={styles.emptyCart}>
          <h2>Your cart is empty</h2>
          <p>Start shopping to add items to your cart</p>
          <button style={styles.continueBtn} onClick={() => navigate("/")}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <div style={styles.cartContainer}>
          <div style={{ flex: 2 }}>
            {cartItems.map((item) => (
              <div key={item._id} style={styles.cartItem}>
                <img
                  src={
                    item.productId?.image ||
                    "https://via.placeholder.com/120?text=Product"
                  }
                  alt={item.productId?.name || "Product"}
                  style={styles.itemImage}
                />
                <div style={styles.itemDetails}>
                  <div>
                    <h3 style={styles.itemName}>
                      {item.productId?.name || "Product"}
                    </h3>
                    <p style={styles.itemPrice}>
                      ${item.priceAtAddition.toFixed(2)} × {item.quantity} ={" "}
                      <strong>
                        ${(item.priceAtAddition * item.quantity).toFixed(2)}
                      </strong>
                    </p>
                  </div>

                  <div style={styles.quantityControl}>
                    <button
                      style={styles.quantityBtn}
                      onClick={() =>
                        updateQuantity(item._id, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1 || loading}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      min="1"
                      style={styles.quantityInput}
                      onChange={(e) => {
                        const newQuantity = parseInt(e.target.value);
                        if (!isNaN(newQuantity)) {
                          updateQuantity(item._id, newQuantity);
                        }
                      }}
                      disabled={loading}
                    />
                    <button
                      style={styles.quantityBtn}
                      onClick={() =>
                        updateQuantity(item._id, item.quantity + 1)
                      }
                      disabled={loading}
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  style={styles.removeBtn}
                  onClick={() => removeItem(item._id)}
                  disabled={loading}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div style={styles.summaryCard}>
            <h2 style={{ marginBottom: "20px" }}>Order Summary</h2>
            <div style={styles.summaryRow}>
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div style={styles.summaryRow}>
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            <div style={styles.summaryRow}>
              <span>Tax</span>
              <span>Calculated at checkout</span>
            </div>
            <div style={styles.totalRow}>
              <span>Estimated Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <button
              style={styles.checkoutBtn}
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
