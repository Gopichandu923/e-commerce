// src/components/ProductCard.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  if (!product) return null;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:4040/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product._id,
          quantity: 1,
        }),
      });

      if (!response.ok) throw new Error("Failed to add to cart");
      // Handle success (e.g., show notification)
    } catch (error) {
      console.error("Add to cart error:", error);
    }
  };

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:4040/api/favorite/${product._id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to update favorites");
      setIsFavorite(!isFavorite);
      // Handle success
    } catch (error) {
      console.error("Favorite error:", error);
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

        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleToggleFavorite}
            className="bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 ${
                isFavorite ? "text-red-500 fill-current" : "text-gray-700"
              }`}
              viewBox="0 0 20 20"
              fill={isFavorite ? "currentColor" : "none"}
              stroke="currentColor"
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
            className="bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-700"
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

      {/* Product Info */}
      <div className="p-4 flex-grow flex flex-col">
        <Link to={`/product/${product._id}`}>
          <h3 className="text-sm text-gray-700 truncate group-hover:text-blue-600 transition-colors duration-300">
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
