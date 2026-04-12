import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getFavourites,
  removeFromFavourites,
} from "../redux/favourites/favouriteActions";
import { getUserFromCookie } from "../utils/cookie.js";
import { AddItemToCart } from "../Api.js";
import toast from "react-hot-toast";

const FavoriteComponent = ({ darkMode = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { favourite, loading, error } = useSelector(
    (state) => state.favourites
  );
  const [isBrowser, setIsBrowser] = useState(false);
  const [addingToCart, setAddingToCart] = useState({});
  const hasFetched = useRef(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const currentUser = useMemo(() => {
    return isBrowser ? getUserFromCookie() : null;
  }, [isBrowser]);

  const token = currentUser?.token;

  useEffect(() => {
    if (!isBrowser) return;
    
    if (currentUser?.token && !hasFetched.current) {
      hasFetched.current = true;
      dispatch(getFavourites());
    }
  }, [dispatch, isBrowser, currentUser]);

  const handleRemoveFavorite = (id) => {
    if (currentUser?.token) {
      dispatch(removeFromFavourites(id));
    }
  };

  const handleAddToCart = async (productId, productName) => {
    if (!token) {
      toast.error("Please log in to add items to your cart.");
      navigate("/login");
      return;
    }
    
    if (addingToCart[productId]) return;
    
    setAddingToCart(prev => ({ ...prev, [productId]: true }));
    
    try {
      await AddItemToCart(token, productId);
      toast.success(`${productName} added to cart!`);
    } catch (err) {
      toast.error(`Error: ${err.response?.data?.message || err.message}`);
    } finally {
      setAddingToCart(prev => ({ ...prev, [productId]: false }));
    }
  };

  if (!currentUser) {
    return (
      <div className="w-full">
        <div className="space-y-2 mb-8">
          <span className="text-secondary font-label text-xs tracking-[0.2em] uppercase">
            Private Selection
          </span>
          <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tighter text-primary">
            Your Wishlist
          </h1>
        </div>
        
        <div className="bg-[#f5f3f4] rounded-xl p-12 text-center">
          <h2 className="text-2xl font-headline font-bold text-[#041627] mb-3">
            Sign in to view your wishlist
          </h2>
          <p className="text-[#44474c] font-body mb-8">
            Save your favorite pieces for later
          </p>
          <Link
            to="/login"
            className="btn-gradient px-6 py-3 rounded-lg text-white font-label text-sm tracking-widest uppercase hover:opacity-90 transition-opacity"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div className="space-y-2">
          <span className="text-secondary font-label text-xs tracking-[0.2em] uppercase">
            Private Selection
          </span>
          <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tighter text-primary">
            Your Wishlist
          </h1>
        </div>
        <div className="text-[#44474c] font-label text-sm tracking-wide">
          <span className="font-bold text-[#041627]">{favourite.length}</span> ITEMS SAVED
        </div>
      </div>

      {error && (
        <div className="bg-[#ffdad6] text-[#93000a] p-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin h-10 w-10 border-4 border-[#735c00] border-t-transparent rounded-full"></div>
        </div>
      ) : favourite.length === 0 ? (
        <div className="bg-[#f5f3f4] rounded-xl p-12 text-center">
          <h2 className="text-2xl font-headline font-bold text-[#041627] mb-3">
            No favorite products yet
          </h2>
          <p className="text-[#44474c] font-body mb-8">
            Start adding pieces to your wishlist
          </p>
          <Link
            to="/shop"
            className="btn-gradient px-6 py-3 rounded-lg text-white font-label text-sm tracking-widest uppercase hover:opacity-90 transition-opacity"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {favourite.map((product) => (
            <div
              key={product._id || product.id || product.name}
              className="group relative flex flex-col h-full"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-[#f5f3f4] shrink-0">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-[#e4e2e3] flex items-center justify-center">
                    <span className="text-[#44474c] font-body">No Image</span>
                  </div>
                )}

                <button
                  onClick={() => handleRemoveFavorite(product._id)}
                  className="absolute top-4 right-4 w-10 h-10 bg-surface/90 backdrop-blur-sm rounded-full flex items-center justify-center text-[#041627] hover:text-[#ba1a1a] transition-colors duration-300"
                  aria-label="Remove from favourites"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
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
                <div className="flex justify-between items-start">
                  <h3 className="font-headline font-bold text-base tracking-tight text-[#041627] line-clamp-2">
                    {product.name || "Unnamed Product"}
                  </h3>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-[#44474c] font-label">
                    {product.category}
                  </p>
                  <span className="font-label text-sm text-[#44474c]">
                    ${product.price?.toFixed(2)}
                  </span>
                </div>
                <button 
                  onClick={() => handleAddToCart(product._id, product.name)}
                  disabled={addingToCart[product._id] || product.countInStock === 0}
                  className={`w-full py-2.5 rounded-lg text-white font-label text-xs tracking-widest uppercase transition-opacity ${
                    product.countInStock === 0
                      ? "bg-[#e4e2e3] text-[#44474c] cursor-not-allowed"
                      : "btn-gradient hover:opacity-90"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {product.countInStock === 0 ? "Out of Stock" : addingToCart[product._id] ? "Adding..." : "Add to Cart"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoriteComponent;