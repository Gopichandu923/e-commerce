import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GetProducts } from "../Api";

const Header = ({ cartCount, darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const searchTimeoutRef = useRef(null);

  const categories = [
    { name: "Men's", to: "/shop/men's clothing" },
    { name: "Women's", to: "/shop/women's clothing" },
    { name: "Electronics", to: "/shop/electronics" },
    { name: "Jewelery", to: "/shop/jewelery" },
    { name: "Furniture", to: "/shop/furniture" },
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
    <nav className={`fixed top-0 w-full z-50 glass ${darkMode ? "bg-[#041627]/80" : "bg-surface/80"}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
        <div className="flex items-center justify-between h-16 md:h-20 gap-4">
          <Link to="/" className="flex items-center gap-8 flex-shrink-0">
            <span className={`text-2xl font-black tracking-tighter font-headline ${darkMode ? "text-[#fbf9fa]" : "text-[#041627]"
              }`}>
              ShopEase
            </span>
            <div className="hidden md:flex gap-6 font-headline tracking-tight text-sm uppercase">
              {categories.slice(0, 3).map((cat) => (
                <Link
                  key={cat.name}
                  to={cat.to}
                  className={`transition-colors duration-300 ${darkMode ? "text-[#fbf9fa]/60 hover:text-[#fbf9fa]" : "text-[#041627]/60 hover:text-[#041627]"
                    }`}
                >
                  {cat.name.split(" ")[0]}
                </Link>
              ))}
            </div>
          </Link>

          <div className="flex-1 max-w-md mx-4 relative hidden md:block">
            <form onSubmit={handleSearchSubmit}>
              <div className={`flex items-center w-full rounded-full transition-all duration-300 ${darkMode
                ? "bg-[#1a2b3c]"
                : "bg-[#f5f3f4]"
                }`}>
                <button type="submit" className="pl-4">
                  <span className={`material-symbols-outlined text-xl ${darkMode ? "text-[#fbf9fa]/60" : "text-[#041627]/60"
                    }`}>
                    search
                  </span>
                </button>
                <input
                  type="text"
                  value={searchValue}
                  onChange={handleSearchChange}
                  onFocus={() => searchValue.trim().length >= 2 && suggestions.length > 0 && setShowDropdown(true)}
                  autoComplete="off"
                  placeholder="Search for products..."
                  className={`w-full py-2.5 px-3 bg-transparent border-none outline-none font-label ${darkMode
                    ? "text-[#fbf9fa] placeholder-[#fbf9fa]/50"
                    : "text-[#041627] placeholder-[#041627]/50"
                    }`}
                />
                {searchValue && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="pr-4"
                  >
                    <span className={`material-symbols-outlined text-xl ${darkMode ? "text-[#fbf9fa]/60" : "text-[#041627]/60"
                      }`}>
                      close
                    </span>
                  </button>
                )}
              </div>
            </form>

            {showDropdown && suggestions.length > 0 && (
              <div className={`absolute top-full left-0 right-0 mt-2 rounded-xl shadow-xl z-50 overflow-hidden ${darkMode ? "bg-[#1a2b3c]" : "bg-white"
                }`}>
                {loadingSuggestions ? (
                  <div className={`p-4 flex items-center justify-center gap-2 ${darkMode ? "text-[#fbf9fa]/60" : "text-[#041627]/60"}`}>
                    <div className="animate-spin h-4 w-4 border-2 border-[#735c00] border-t-transparent rounded-full"></div>
                    Searching...
                  </div>
                ) : (
                  <ul>
                    {suggestions.map((product) => (
                      <li
                        key={product._id}
                        onClick={() => handleSuggestionClick(product._id, product.name)}
                        className={`flex items-center p-3 cursor-pointer transition-colors ${darkMode ? "hover:bg-[#041627]" : "hover:bg-[#f5f3f4]"
                          }`}
                      >
                        <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-[#f5f3f4]">
                          <img
                            src={product.image || "https://via.placeholder.com/48"}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0 ml-3">
                          <p className={`text-sm font-medium truncate font-body ${darkMode ? "text-[#fbf9fa]" : "text-[#041627]"
                            }`}>
                            {product.name}
                          </p>
                          <p className={`text-xs font-label ${darkMode ? "text-[#fbf9fa]/60" : "text-[#041627]/60"
                            }`}>
                            {product.category}
                          </p>
                        </div>
                        <span className={`text-sm font-semibold ml-2 font-label ${darkMode ? "text-[#ffe088]" : "text-[#735c00]"
                          }`}>
                          ${product.price?.toFixed(2)}
                        </span>
                      </li>
                    ))}
                    <li
                      onClick={() => handleSuggestionClick(null, searchValue)}
                      className={`p-3 cursor-pointer text-center border-t transition-colors ${darkMode
                        ? "border-[#041627] hover:bg-[#041627]"
                        : "border-[#f5f3f4] hover:bg-[#f5f3f4]"
                        }`}
                    >
                      <span className={`text-sm font-medium font-label ${darkMode ? "text-[#ffe088]" : "text-[#735c00]"
                        }`}>
                        See all results for "{searchValue}" →
                      </span>
                    </li>
                  </ul>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <Link
              to="/favourite"
              className={`p-2.5 rounded-full transition-all duration-200 ${darkMode
                ? "text-[#fbf9fa]/60 hover:text-[#fbf9fa] hover:bg-[#1a2b3c]"
                : "text-[#041627]/60 hover:text-[#041627] hover:bg-[#f5f3f4]"
                }`}
              aria-label="Wishlist"
            >
              <span className="material-symbols-outlined text-xl">favorite</span>
            </Link>

            <Link
              to="/cart"
              className={`relative p-2.5 rounded-full transition-all duration-200 ${darkMode
                ? "text-[#fbf9fa]/60 hover:text-[#fbf9fa] hover:bg-[#1a2b3c]"
                : "text-[#041627]/60 hover:text-[#041627] hover:bg-[#f5f3f4]"
                }`}
              aria-label="Cart"
            >
              <span className="material-symbols-outlined text-xl">shopping_cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#735c00] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <Link
                to="/profile"
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-200 ${darkMode ? "hover:bg-[#1a2b3c]" : "hover:bg-[#f5f3f4]"
                  }`}
              >
                <span className={`material-symbols-outlined text-xl ${darkMode ? "text-[#fbf9fa]/60" : "text-[#041627]/60"
                  }`}>
                  person
                </span>
                <span className={`hidden lg:block text-sm font-medium font-label ${darkMode ? "text-[#fbf9fa]" : "text-[#041627]"
                  }`}>
                  {user?.name?.split(' ')[0]}
                </span>
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 font-label ${darkMode
                    ? "text-[#fbf9fa]/60 hover:text-[#fbf9fa] hover:bg-[#1a2b3c]"
                    : "text-[#041627]/60 hover:text-[#041627] hover:bg-[#f5f3f4]"
                    }`}
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="btn-gradient px-4 py-2 text-sm font-medium text-white rounded-full hover:opacity-90 transition-opacity font-label"
                >
                  Sign up
                </Link>
              </div>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2.5 rounded-full transition-colors duration-200 ${darkMode ? "hover:bg-[#1a2b3c]" : "hover:bg-[#f5f3f4]"
                }`}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <span className={`material-symbols-outlined text-xl ${darkMode ? "text-[#fbf9fa]" : "text-[#041627]"
                  }`}>
                  close
                </span>
              ) : (
                <span className={`material-symbols-outlined text-xl ${darkMode ? "text-[#fbf9fa]" : "text-[#041627]"
                  }`}>
                  menu
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className={`md:hidden border-t ${darkMode ? "border-[#1a2b3c] bg-[#041627]" : "border-[#f5f3f4] bg-[#fbf9fa]"
          }`}>
          <div className="px-6 py-3 space-y-2">
            <Link
              to="/shop"
              className={`block px-4 py-3 rounded-lg font-medium transition-colors font-headline ${darkMode ? "text-[#fbf9fa]/60 hover:bg-[#1a2b3c]" : "text-[#041627]/60 hover:bg-[#f5f3f4]"
                }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              All Products
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={cat.to}
                className={`block px-4 py-3 rounded-lg font-medium transition-colors font-headline ${darkMode ? "text-[#fbf9fa]/60 hover:bg-[#1a2b3c]" : "text-[#041627]/60 hover:bg-[#f5f3f4]"
                  }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {cat.name}
              </Link>
            ))}
          </div>
          <div className={`border-t px-6 py-3 ${darkMode ? "border-[#1a2b3c]" : "border-[#f5f3f4]"
            }`}>
            <button
              onClick={() => { setDarkMode(!darkMode); setMobileMenuOpen(false); }}
              className={`flex items-center gap-3 px-4 py-3 w-full rounded-lg transition-colors font-label ${darkMode ? "hover:bg-[#1a2b3c] text-[#fbf9fa]" : "hover:bg-[#f5f3f4] text-[#041627]"
                }`}
            >
              <span className="material-symbols-outlined text-xl">
                {darkMode ? "light_mode" : "dark_mode"}
              </span>
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;