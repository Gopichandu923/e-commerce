import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AddItemToCart,
  AddItemToFavourites,
  RemoveItemFromFavourites,
} from "../Api";
import { getUserFromCookie } from "../utils/cookie.js";
import toast from "react-hot-toast";

const ProductCard = ({ product, initialIsFavorite = false, darkMode = false }) => {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [addingToCart, setAddingToCart] = useState(false);
  const [togglingFavorite, setTogglingFavorite] = useState(false);
  const navigate = useNavigate();
  const token = getUserFromCookie()?.token;
  const userInfo = token;

  if (!product) return null;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userInfo) {
      toast.error("Please log in to add items to your cart.");
      navigate("/login");
      return;
    }

    if (addingToCart) return;

    setAddingToCart(true);
    try {
      console.log(token);
      const { data } = await AddItemToCart(token, product._id);
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userInfo) {
      toast.error("Please log in to manage your favorites.");
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
        response = await AddItemToFavourites(token, product._id);
      } else {
        response = await RemoveItemFromFavourites(token, product._id);
      }

      if (response.status !== 200) {
        throw new Error(response.data?.message || "Failed to update favorites");
      }

      setIsFavorite(targetIsFavorite);

      if (targetIsFavorite) {
        toast.success(`${product.name} added to favorites!`);
      } else {
        toast.success(`${product.name} removed from favorites!`);
      }

      console.log("Updated favorites list:", response.data.favorites);
    } catch (error) {
      console.error("Favorite error:", error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setTogglingFavorite(false);
    }
  };

  return (
    <div className={`group relative flex flex-col h-full ${darkMode ? "bg-[#1a2b3c]" : "bg-[#ffffff]"}`} key={product._id}>
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-[#f5f3f4] shrink-0">
        <Link to={`/product/${product._id}`} className="block w-full h-full">
          <img
            src={
              product.image || "https://via.placeholder.com/300?text=No+Image"
            }
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>
        
        <button
          onClick={handleToggleFavorite}
          disabled={togglingFavorite}
          className={`absolute top-4 right-4 w-10 h-10 bg-surface/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors duration-300 ${
            darkMode ? "hover:bg-[#1a2b3c]" : "hover:bg-[#f5f3f4]"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          aria-label={
            isFavorite ? "Remove from favorites" : "Add to favorites"
          }
        >
          <span className={`material-symbols-outlined text-lg transition-colors duration-200 ${
            isFavorite
              ? "text-[#2e0800]"
              : darkMode ? "text-[#fbf9fa]/60 hover:text-[#fbf9fa]" : "text-[#041627]/60 hover:text-[#041627]"
          }`}>
            {isFavorite ? "favorite" : "favorite"}
          </span>
        </button>

        {product.countInStock === 0 && (
          <div className="absolute inset-0 bg-[#041627]/20 backdrop-grayscale flex items-center justify-center">
            <span className="bg-surface/95 px-4 py-2 text-[10px] tracking-[0.3em] font-label uppercase text-primary">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="mt-auto pt-4 flex flex-col gap-2">
        <Link to={`/product/${product._id}`} className="block">
          <h3 className="font-headline font-bold text-base tracking-tight text-[#041627] dark:text-[#fbf9fa] line-clamp-2">
            {product.name}
          </h3>
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-[#44474c] font-label">
              {product.category}
            </p>
            <span className="font-label text-sm text-[#44474c]">
              ${product.price?.toFixed(2)}
            </span>
          </div>
        </Link>
        <button
          onClick={handleAddToCart}
          disabled={addingToCart || product.countInStock === 0}
          className={`w-full py-2.5 rounded-lg text-white font-label text-xs tracking-widest uppercase transition-opacity font-medium ${
            product.countInStock === 0
              ? (darkMode ? "bg-[#e4e2e3] text-[#44474c] cursor-not-allowed" : "bg-[#e4e2e3] text-[#44474c] cursor-not-allowed")
              : "btn-gradient hover:opacity-90"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {product.countInStock === 0 ? "Notify Me" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
