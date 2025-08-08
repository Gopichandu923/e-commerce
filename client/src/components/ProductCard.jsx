import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AddItemToCart,
  AddItemToFavourites,
  RemoveItemFromFavourites,
} from "../Api";

const ProductCard = ({ product, initialIsFavorite = false }) => {
  // Added initialIsFavorite prop
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [addingToCart, setAddingToCart] = useState(false);
  const [togglingFavorite, setTogglingFavorite] = useState(false);
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("user")).token;
  const userInfo = token;

  if (!product) return null;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userInfo) {
      alert("Please log in to add items to your cart.");
      navigate("/login");
      return;
    }
    if (addingToCart) return;

    setAddingToCart(true);
    try {
      console.log(token);
      const response = await AddItemToCart(token, product._id);
      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Failed to add to cart" }));
        throw new Error(errorData.message || "Failed to add to cart");
      }
      const data = await response.json();
      console.log("Added to cart:", data);
      alert(`${product.name} added to cart!`);
    } catch (error) {
      console.error("Add to cart error:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setAddingToCart(false);
    }
  };
  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userInfo) {
      alert("Please log in to manage your favorites.");
      navigate("/login");
      return;
    }
    if (togglingFavorite) return;

    setTogglingFavorite(true);
    const targetIsFavorite = !isFavorite;

    try {
      console.log(token);
      let response;

      if (targetIsFavorite) {
        // Add to favourites
        response = await AddItemToFavourites(token, product._id);
      } else {
        // Remove from favourites
        response = await RemoveItemFromFavourites(token, product._id);
      }

      // Axios responses have status + data
      if (response.status !== 200) {
        throw new Error(response.data?.message || "Failed to update favorites");
      }

      setIsFavorite(targetIsFavorite);

      alert(
        targetIsFavorite
          ? `${product.name} added to favorites!`
          : `${product.name} removed from favorites!`
      );

      console.log("Updated favorites list:", response.data.favorites);
    } catch (error) {
      console.error("Favorite error:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setTogglingFavorite(false);
    }
  };

  return (
    <div className="group bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 flex flex-col h-full">
      <div className="relative">
        <Link to={`/product/${product._id}`} className="block">
          <div className="aspect-square w-full overflow-hidden">
            <img
              src={
                product.image || "https://via.placeholder.com/300?text=No+Image"
              }
              alt={product.name}
              className="w-full h-full object-cover object-center group-hover:opacity-75 transition-opacity duration-300"
            />
          </div>
        </Link>

        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleToggleFavorite}
            disabled={togglingFavorite}
            className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 transition-colors duration-200 ${
                isFavorite
                  ? "text-red-500 fill-current"
                  : "text-gray-500 hover:text-red-400"
              }`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <button
            onClick={handleAddToCart}
            disabled={addingToCart || product.countInStock === 0}
            className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Add to cart"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500 hover:text-blue-500 transition-colors duration-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="p-4 flex-grow flex flex-col">
        <Link to={`/product/${product._id}`}>
          <h3 className="text-sm text-gray-700 truncate group-hover:text-blue-600 transition-colors duration-300 h-10 mb-1 flex items-center">
            {product.name}
          </h3>
          <p className="mt-1 text-lg font-medium text-gray-900">
            ${product.price?.toFixed(2)}
          </p>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
