import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FiSearch,
  FiShoppingCart,
  FiUser,
  FiHeart,
  FiMenu,
  FiX,
  FiMoon,
  FiSun,
  FiLogOut,
} from "react-icons/fi";
import { logout } from "../redux/auth/authActions";
import { GetProducts } from "../Api";

const Header = ({ cartCount, darkMode, setDarkMode }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const searchTimeoutRef = useRef(null);

  const categories = [
    { name: "Men's Clothing", to: "/shop/mens-clothing" },
    { name: "Women's Clothing", to: "/shop/womens-clothing" },
    { name: "Electronics", to: "/shop/electronics" },
    { name: "Jewelery", to: "/shop/jewelery" },
    { name: "Home & Furniture", to: "/shop/furniture" },
  ];

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (value.trim().length >= 2) {
      searchTimeoutRef.current = setTimeout(async () => {
        setLoadingSuggestions(true);
        try {
          const response = await GetProducts(value.trim(), 1, 5);
          const products = response.data?.products || [];
          setSuggestions(products);
          setShowDropdown(products.length > 0);
        } catch (error) {
          console.error("Search error:", error);
          setSuggestions([]);
          setShowDropdown(false);
        } finally {
          setLoadingSuggestions(false);
        }
      }, 500);
    } else {
      setSuggestions([]);
      setShowDropdown(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`);
      setSearchValue("");
      setSuggestions([]);
      setShowDropdown(false);
    }
  };

  const handleSuggestionClick = (productId, productName) => {
    if (productId) {
      navigate(`/product/${productId}`);
    } else {
      navigate(`/search?q=${encodeURIComponent(productName)}`);
    }
    setSearchValue("");
    setSuggestions([]);
    setShowDropdown(false);
  };

  const handleClearSearch = () => {
    setSearchValue("");
    setSuggestions([]);
    setShowDropdown(false);
  };

  return (
    <nav className={`sticky top-0 z-50 ${darkMode ? "bg-gray-900/95" : "bg-white/95"} backdrop-blur-md shadow-sm`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              darkMode ? "bg-blue-600" : "bg-gradient-to-br from-blue-500 to-purple-600"
            }`}>
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <div className={`hidden sm:block font-bold text-xl tracking-tight ${
              darkMode ? "text-white" : "text-gray-900"
            }`}>
              <span className="text-blue-600">Shop</span><span className="text-orange-500">EZ</span>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl mx-4 relative">
            <form onSubmit={handleSearchSubmit}>
              <div className={`flex items-center w-full rounded-full border transition-all duration-300 ${
                darkMode 
                  ? "bg-gray-800 border-gray-700 focus-within:border-blue-500" 
                  : "bg-gray-100 border-gray-200 focus-within:border-blue-500"
              } focus-within:ring-2 focus-within:ring-blue-500/20`}>
                <div className="pl-4">
                  <FiSearch className={`h-5 w-5 ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
                </div>
                <input
                  type="text"
                  value={searchValue}
                  onChange={handleSearchChange}
                  onFocus={() => searchValue.trim().length >= 2 && suggestions.length > 0 && setShowDropdown(true)}
                  autoComplete="off"
                  placeholder="Search for products..."
                  className={`w-full py-2.5 px-3 bg-transparent border-none outline-none ${
                    darkMode 
                      ? "text-white placeholder-gray-500" 
                      : "text-gray-900 placeholder-gray-500"
                  }`}
                />
                {searchValue && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="pr-4"
                  >
                    <FiX className={`h-4 w-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
                  </button>
                )}
              </div>
            </form>
            
            {showDropdown && suggestions.length > 0 && (
              <div className={`absolute top-full left-0 right-0 mt-2 rounded-xl shadow-xl border z-50 overflow-hidden ${
                darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
              }`}>
                {loadingSuggestions ? (
                  <div className={`p-4 flex items-center justify-center gap-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                    Searching...
                  </div>
                ) : (
                  <ul>
                    {suggestions.map((product) => (
                      <li
                        key={product._id}
                        onClick={() => handleSuggestionClick(product._id, product.name)}
                        className={`flex items-center p-3 cursor-pointer transition-colors ${
                          darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                        }`}
                      >
                        <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                          <img
                            src={product.image || "https://via.placeholder.com/48"}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0 ml-3">
                          <p className={`text-sm font-medium truncate ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}>
                            {product.name}
                          </p>
                          <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                            {product.category}
                          </p>
                        </div>
                        <span className={`text-sm font-semibold ml-2 ${
                          darkMode ? "text-blue-400" : "text-blue-600"
                        }`}>
                          ${product.price?.toFixed(2)}
                        </span>
                      </li>
                    ))}
                    <li
                      onClick={() => handleSuggestionClick(null, searchValue)}
                      className={`p-3 cursor-pointer text-center border-t transition-colors ${
                        darkMode
                          ? "hover:bg-gray-700 border-gray-700"
                          : "hover:bg-gray-50 border-gray-100"
                      }`}
                    >
                      <span className={`text-sm font-medium ${
                        darkMode ? "text-blue-400" : "text-blue-600"
                      }`}>
                        See all results for "{searchValue}" →
                      </span>
                    </li>
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Navigation Icons */}
          <div className="flex items-center gap-1">
            <Link
              to="/favourite"
              className={`p-2.5 rounded-full transition-all duration-200 ${darkMode ? "text-gray-400 hover:text-red-400 hover:bg-gray-800" : "text-gray-600 hover:text-red-500 hover:bg-gray-100"
                }`}
              aria-label="Wishlist"
            >
              <FiHeart className="h-5 w-5" />
            </Link>

            <Link
              to="/cart"
              className={`relative p-2.5 rounded-full transition-all duration-200 ${darkMode ? "text-gray-400 hover:bg-gray-800" : "text-gray-600 hover:bg-gray-100"
                }`}
              aria-label="Cart"
            >
              <FiShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-2 ml-2">
                <Link
                  to="/profile"
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-200 ${darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
                    }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${darkMode ? "bg-gray-700" : "bg-blue-100"
                    }`}>
                    <FiUser className={`h-4 w-4 ${darkMode ? "text-gray-300" : "text-blue-600"}`} />
                  </div>
                  <span className={`hidden lg:block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"
                    }`}>
                    {user?.name?.split(' ')[0]}
                  </span>
                </Link>
                <button
                  onClick={() => dispatch(logout())}
                  className={`p-2 rounded-full transition-all duration-200 ${darkMode ? "text-gray-400 hover:text-red-400 hover:bg-gray-800" : "text-gray-600 hover:text-red-500 hover:bg-gray-100"
                    }`}
                  aria-label="Logout"
                >
                  <FiLogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-2">
                <Link
                  to="/login"
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${darkMode
                    ? "text-gray-300 hover:bg-gray-800"
                    : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-all duration-200"
                >
                  Sign up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2.5 rounded-full transition-colors duration-200 ${darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
                }`}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <FiX className={`h-5 w-5 ${darkMode ? "text-gray-300" : "text-gray-700"}`} />
              ) : (
                <FiMenu className={`h-5 w-5 ${darkMode ? "text-gray-300" : "text-gray-700"}`} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={`md:hidden border-t ${darkMode ? "border-gray-800 bg-gray-900" : "border-gray-100 bg-white"}`}>
          <div className="px-4 py-3 space-y-2">
            <Link
              to="/shop"
              className={`block px-4 py-3 rounded-lg font-medium transition-colors ${darkMode ? "text-gray-300 hover:bg-gray-800" : "text-gray-700 hover:bg-gray-100"
                }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              All Products
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={cat.to}
                className={`block px-4 py-3 rounded-lg font-medium transition-colors ${darkMode ? "text-gray-300 hover:bg-gray-800" : "text-gray-700 hover:bg-gray-100"
                  }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {cat.name}
              </Link>
            ))}
          </div>
          <div className={`border-t px-4 py-3 ${darkMode ? "border-gray-800" : "border-gray-100"}`}>
            <button
              onClick={() => { setDarkMode(!darkMode); setMobileMenuOpen(false); }}
              className={`flex items-center gap-3 px-4 py-3 w-full rounded-lg transition-colors ${darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
                }`}
            >
              {darkMode ? <FiSun className="h-5 w-5 text-yellow-400" /> : <FiMoon className="h-5 w-5 text-gray-600" />}
              <span className={darkMode ? "text-gray-300" : "text-gray-700"}>
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;