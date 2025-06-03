import React, { useState, useEffect } from "react";

const FavoriteComponent = () => {
  const [favorites, setFavorites] = useState([]);
  const [newProductId, setNewProductId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Styles object for internal CSS
  const styles = {
    container: {
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      maxWidth: "800px",
      margin: "0 auto",
      padding: "20px",
      backgroundColor: "#f8f9fa",
      borderRadius: "8px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    },
    header: {
      color: "#343a40",
      borderBottom: "2px solid #e9ecef",
      paddingBottom: "10px",
      marginBottom: "20px",
    },
    inputGroup: {
      display: "flex",
      marginBottom: "20px",
      gap: "10px",
    },
    input: {
      flex: 1,
      padding: "10px",
      border: "1px solid #ced4da",
      borderRadius: "4px",
      fontSize: "16px",
    },
    button: {
      padding: "10px 15px",
      backgroundColor: "#007bff",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "16px",
      fontWeight: "500",
      transition: "background-color 0.2s",
    },
    buttonRemove: {
      backgroundColor: "#dc3545",
      padding: "5px 10px",
      fontSize: "14px",
      marginLeft: "10px",
    },
    buttonHover: {
      backgroundColor: "#0056b3",
    },
    list: {
      listStyleType: "none",
      padding: 0,
    },
    listItem: {
      backgroundColor: "white",
      padding: "15px",
      marginBottom: "10px",
      borderRadius: "4px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    },
    error: {
      color: "#dc3545",
      backgroundColor: "#f8d7da",
      padding: "10px",
      borderRadius: "4px",
      marginBottom: "20px",
    },
    loading: {
      textAlign: "center",
      padding: "20px",
    },
  };

  // Fetch user's favorites
  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:4040/api/favourite", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch favorites");

      const data = await response.json();
      setFavorites(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add to favorites
  const handleAddFavorite = async () => {
    if (!newProductId.trim()) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:4040/api/favourite/${newProductId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add favorite");
      }
      const data = response.json();
      console.log(data);
      setFavorites(
        data.favorites || [
          ...favorites,
          { _id: newProductId, name: `Product ${newProductId}` },
        ]
      );
      setNewProductId("");
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Remove from favorites
  const handleRemoveFavorite = async (productId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:4040/api/favourite/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to remove favorite");
      }

      const data = response.json();
      console.log(data);
      setFavorites(
        data.favorites ||
          favorites.filter((product) => product._id !== productId)
      );
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Your Favorite Products</h2>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.inputGroup}>
        <input
          type="text"
          value={newProductId}
          onChange={(e) => setNewProductId(e.target.value)}
          placeholder="Enter product ID"
          style={styles.input}
        />
        <button
          onClick={handleAddFavorite}
          style={styles.button}
          onMouseOver={(e) =>
            (e.target.style.backgroundColor =
              styles.buttonHover.backgroundColor)
          }
          onMouseOut={(e) =>
            (e.target.style.backgroundColor = styles.button.backgroundColor)
          }
          disabled={loading}
        >
          Add Favorite
        </button>
      </div>

      {loading ? (
        <div style={styles.loading}>Loading favorites...</div>
      ) : (
        <ul style={styles.list}>
          {favorites.map((product) => (
            <li key={product._id} style={styles.listItem}>
              <div>
                <strong>{product.name}</strong> - ID: {product._id}
              </div>
              <button
                onClick={() => handleRemoveFavorite(product._id)}
                style={{ ...styles.button, ...styles.buttonRemove }}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#bd2130")
                }
                onMouseOut={(e) =>
                  (e.target.style.backgroundColor =
                    styles.buttonRemove.backgroundColor)
                }
                disabled={loading}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      {!loading && favorites.length === 0 && (
        <div style={{ textAlign: "center", color: "#6c757d" }}>
          No favorite products yet
        </div>
      )}
    </div>
  );
};

export default FavoriteComponent;
