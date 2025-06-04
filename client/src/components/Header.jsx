// src/components/Navbar.js
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiShoppingCart,
  FiUser,
  FiHeart,
  FiMenu,
  FiX,
  FiMoon,
  FiSun,
} from "react-icons/fi";

const Navbar = ({ cartCount, darkMode, setDarkMode }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  const categories = [
    { name: "Men's Clothing", to: "/shop/mens-clothing" },
    { name: "Women's Clothing", to: "/shop/womens-clothing" },
    { name: "Electronics", to: "/shop/electronics" },
    { name: "Jewelery", to: "/shop/jewelery" },
    { name: "Home & Furniture", to: "/shop/furniture" },
  ];

  useEffect(() => {
    const handleResize = () => {
      const currentWidth = window.innerWidth;
      setWindowWidth(currentWidth);
      if (currentWidth >= 768) {
        // md breakpoint
        setIsSearchExpanded(true); // Search always expanded on desktop
        setMobileMenuOpen(false);
      } else {
        // For mobile, if search was expanded, keep it expanded on minor resizes
        // If it was collapsed, keep it collapsed.
        // If you want it to always collapse on resize to mobile:
        // setIsSearchExpanded(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isSearchExpanded && windowWidth < 768 && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchExpanded, windowWidth]);

  const toggleSearch = () => {
    // This function is primarily for mobile to expand/collapse the search icon into a bar
    if (windowWidth < 768) {
      setIsSearchExpanded(!isSearchExpanded);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`);
      setSearchValue("");
      if (windowWidth < 768) {
        setIsSearchExpanded(false); // Collapse after search on mobile
      }
    }
  };

  const SearchBar = () => (
    <form
      onSubmit={handleSearchSubmit}
      className={`relative transition-all duration-300 ease-in-out 
                 ${darkMode ? "bg-gray-800" : "bg-gray-100"}
                 ${
                   isSearchExpanded
                     ? "w-full md:max-w-md lg:max-w-lg rounded-xl" // Full width on mobile when expanded, max-width on desktop
                     : "w-10 h-10 rounded-full cursor-pointer flex items-center justify-center md:w-full md:max-w-md lg:max-w-lg md:rounded-xl" // Collapsed on mobile, expanded with max-width on desktop
                 }
                `}
    >
      {/* Desktop search is always expanded (due to useEffect), mobile search toggles */}
      {isSearchExpanded || windowWidth >= 768 ? (
        <>
          <input
            ref={searchInputRef}
            id="search-input"
            type="search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search products..."
            className={`py-2 pl-10 pr-4 md:pr-10 block w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              darkMode
                ? "bg-gray-800 text-white placeholder-gray-400"
                : "bg-gray-100 text-gray-900 placeholder-gray-500"
            }`}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch
              className={`h-5 w-5 ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            />
          </div>
          {/* Close button for mobile search only when search is expanded on mobile */}
          {isSearchExpanded && windowWidth < 768 && (
            <button
              type="button"
              onClick={toggleSearch} // This will set isSearchExpanded to false on mobile
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              aria-label="Close search"
            >
              <FiX
                className={`h-5 w-5 ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              />
            </button>
          )}
        </>
      ) : (
        // This part is now only for the collapsed search icon on mobile
        <button
          type="button"
          className="p-2 flex items-center justify-center w-full h-full"
          onClick={toggleSearch} // This will set isSearchExpanded to true on mobile
          aria-label="Open search"
        >
          <FiSearch
            className={`h-5 w-5 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          />
        </button>
      )}
    </form>
  );

  return (
    <nav
      className={`sticky top-0 z-50 ${
        darkMode ? "bg-gray-900 text-gray-200" : "bg-white text-gray-800"
      } shadow-lg backdrop-filter backdrop-blur-sm bg-opacity-90 transition-colors duration-300`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div
            className={`flex items-center ${
              isSearchExpanded && windowWidth < 768
                ? "hidden"
                : "block md:flex-none"
            }`}
          >
            {/* md:flex-none helps prevent logo from shrinking too much if search bar needs space initially */}
            <Link to="/" className="flex-shrink-0 flex items-center">
              <div
                className={`font-bold text-2xl tracking-tighter ${
                  darkMode ? "text-blue-400" : "text-blue-600"
                }`}
              >
                <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  SHOP
                </span>
                <span className="text-orange-500">EZ</span>
              </div>
            </Link>
          </div>

          {/* Search Bar Container - This will center the SearchBar component */}
          <div className="flex-1 flex justify-center items-center min-w-0 px-2 sm:px-4">
            <SearchBar />
          </div>

          {/* Desktop Navigation Icons */}
          <div className="hidden md:flex items-center space-x-4 md:flex-none">
            {" "}
            {/* md:flex-none to prevent shrinking */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-full transition-all duration-300 ${
                darkMode
                  ? "text-yellow-300 hover:bg-gray-700"
                  : "text-gray-600 hover:bg-gray-200"
              } hover:scale-110`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <FiSun className="h-6 w-6" />
              ) : (
                <FiMoon className="h-6 w-6" />
              )}
            </button>
            <Link
              to="/wishlist"
              className={`p-2 rounded-full relative transition-all duration-300 ${
                darkMode
                  ? "text-gray-300 hover:bg-gray-700"
                  : "text-gray-700 hover:bg-gray-200"
              } hover:scale-110`}
              aria-label="Wishlist"
            >
              <FiHeart className="h-6 w-6" />
              <span className="sr-only">Wishlist</span>
            </Link>
            <Link
              to="/cart"
              className="relative group block rounded-full"
              aria-label="Cart"
            >
              <div
                className={`p-2 rounded-full transition-all duration-300 group-hover:scale-110 ${
                  darkMode
                    ? "text-gray-300 group-hover:bg-gray-700"
                    : "text-gray-700 group-hover:bg-gray-200"
                }`}
              >
                <FiShoppingCart className="h-6 w-6" />
              </div>
              <span className="sr-only">View Shopping Cart</span>
              {cartCount > 0 && (
                <span
                  className={`absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md transition-transform duration-200 group-hover:scale-110`}
                >
                  {cartCount}
                </span>
              )}
            </Link>
            <Link
              to="/account"
              className={`p-1 rounded-full transition-all duration-300 ${
                darkMode
                  ? "text-gray-300 hover:bg-gray-700"
                  : "text-gray-700 hover:bg-gray-200"
              } hover:scale-105`}
              aria-label="Account"
            >
              <div className="flex items-center space-x-2 px-2 py-1">
                <FiUser className="h-6 w-6" />
                <span className="font-medium text-sm">Account</span>
              </div>
            </Link>
          </div>

          {/* Mobile Icons Area */}
          <div
            className={`flex items-center md:hidden ${
              isSearchExpanded && windowWidth < 768 ? "hidden" : "flex"
            }`}
          >
            <div className="flex items-center space-x-2">
              <Link
                to="/cart"
                className="p-2 rounded-full relative"
                aria-label="Cart"
              >
                <FiShoppingCart className="h-6 w-6" />
                <span className="sr-only">Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2 rounded-md transition-colors duration-300 ${
                  darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
                }`}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <FiX className="h-6 w-6" />
                ) : (
                  <FiMenu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu ... (rest of the mobile menu code remains the same) ... */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          // ... (mobile menu JSX)
          className={`md:hidden absolute w-full ${
            darkMode
              ? "bg-gray-900 border-gray-700"
              : "bg-white border-gray-200"
          } border-t shadow-xl transition-transform duration-300 ease-in-out origin-top ${
            mobileMenuOpen ? "scale-y-100" : "scale-y-0"
          }`}
        >
          <div className="pt-2 pb-3 space-y-1 px-4">
            <Link
              to="/shop"
              className={`block pl-3 pr-4 py-3 rounded-lg font-medium ${
                darkMode
                  ? "text-gray-300 hover:bg-gray-800 hover:text-white"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              } transition-colors duration-300`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Shop All
            </Link>
            {categories.map((category) => (
              <Link
                key={category.name}
                to={category.to}
                className={`block pl-3 pr-4 py-3 rounded-lg font-medium ${
                  darkMode
                    ? "text-gray-300 hover:bg-gray-800 hover:text-white"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                } transition-colors duration-300`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {category.name}
              </Link>
            ))}
          </div>

          <div
            className={`pt-4 pb-3 border-t px-4 flex items-center justify-between ${
              darkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  setDarkMode(!darkMode);
                  setMobileMenuOpen(false);
                }}
                className={`p-2 rounded-full ${
                  darkMode
                    ? "text-yellow-300 hover:bg-gray-700"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <FiSun className="h-6 w-6" />
                ) : (
                  <FiMoon className="h-6 w-6" />
                )}
              </button>

              <Link
                to="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className={`p-2 rounded-full ${
                  darkMode
                    ? "text-gray-300 hover:bg-gray-700"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
                aria-label="Wishlist"
              >
                <FiHeart className="h-6 w-6" />
              </Link>

              <Link
                to="/account"
                onClick={() => setMobileMenuOpen(false)}
                className={`p-2 rounded-full ${
                  darkMode
                    ? "text-gray-300 hover:bg-gray-700"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
                aria-label="Account"
              >
                <FiUser className="h-6 w-6" />
              </Link>
            </div>
          </div>

          <div
            className={`px-4 py-3 border-t ${
              darkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <Link
              to="/account"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center space-x-3 py-3`}
            >
              <div
                className={`p-2 rounded-full ${
                  darkMode ? "bg-gray-700" : "bg-gray-200"
                }`}
              >
                <FiUser className="h-6 w-6" />
              </div>
              <div>
                <p className="font-medium">Your Account</p>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  View profile & orders
                </p>
              </div>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
