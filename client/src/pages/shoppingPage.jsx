import React, { useState, useEffect, useCallback } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard.jsx";

const API_BASE_URL = "http://localhost:4040/api";

const priceRanges = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "$0 - $50", min: 0, max: 50 },
  { label: "$50 - $100", min: 50, max: 100 },
  { label: "$100 - $250", min: 100, max: 250 },
  { label: "$250+", min: 250, max: Infinity },
];

const ShopPage = () => {
  const { categoryName: routeCategory } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [allAvailableCategories, setAllAvailableCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState(priceRanges[0]);
  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/product/categories`);

        setAllAvailableCategories([
          "all",
          ...data.map((cat) => cat.name.toLowerCase()),
        ]);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        if (!allAvailableCategories.includes("all")) {
          setAllAvailableCategories(["all"]);
        }
      }
    };
    fetchAllCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = `${API_BASE_URL}/product`;
        if (routeCategory) {
          url = `${API_BASE_URL}/product/category/${encodeURIComponent(
            routeCategory.toLowerCase()
          )}`;
          setSelectedCategory(routeCategory.toLowerCase());
        } else {
          // If coming from a query param like /shop?category=electronics
          const queryParams = new URLSearchParams(location.search);
          const queryCategory = queryParams.get("category");
          if (queryCategory) {
            url = `${API_BASE_URL}/product/category/${encodeURIComponent(
              queryCategory.toLowerCase()
            )}`;
            setSelectedCategory(queryCategory.toLowerCase());
          } else {
            setSelectedCategory("all"); // Default if no route or query param
          }
        }
        const { data } = await axios.get(url);
        // Your getAllProducts and getProductsByCategory controllers should return an array of products
        // If they return an object like { products: [...] }, adjust here:
        // setProducts(Array.isArray(data) ? data : data.products || []);
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError(err.message || "Failed to load products.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [routeCategory, location.search]); // Re-fetch if routeCategory or query params change

  // Apply filters whenever products or filter criteria change
  const applyFilters = useCallback(() => {
    let tempFilteredProducts = [...products];

    // Category filter (applied if not 'all' and not already filtered by routeCategory)
    // The initial fetch already handles routeCategory, so this is for subsequent UI filter changes
    if (selectedCategory !== "all" && !routeCategory) {
      tempFilteredProducts = tempFilteredProducts.filter(
        (product) => product.category.toLowerCase() === selectedCategory
      );
    }

    // Price filter
    if (selectedPriceRange.label !== "All Prices") {
      tempFilteredProducts = tempFilteredProducts.filter(
        (product) =>
          product.price >= selectedPriceRange.min &&
          product.price <= selectedPriceRange.max
      );
    }

    // Search term filter (on name and description)
    if (searchTerm.trim() !== "") {
      const lowerSearchTerm = searchTerm.toLowerCase();
      tempFilteredProducts = tempFilteredProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(lowerSearchTerm) ||
          product.description.toLowerCase().includes(lowerSearchTerm)
      );
    }
    setFilteredProducts(tempFilteredProducts);
  }, [
    products,
    selectedCategory,
    selectedPriceRange,
    searchTerm,
    routeCategory,
  ]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setSelectedCategory(newCategory);
    // If user selects a category from dropdown, navigate to update URL
    // and let the useEffect for fetching products handle the data load.
    // This keeps the URL in sync.
    if (newCategory === "all") {
      navigate("/shop");
    } else {
      navigate(`/shop/${newCategory}`);
    }
  };

  const handlePriceChange = (e) => {
    const selectedLabel = e.target.value;
    const newPriceRange =
      priceRanges.find((pr) => pr.label === selectedLabel) || priceRanges[0];
    setSelectedPriceRange(newPriceRange);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearFilters = () => {
    setSelectedCategory("all");
    setSelectedPriceRange(priceRanges[0]);
    setSearchTerm("");
    navigate("/shop");
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center text-xl">
        Loading products...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center text-red-500 text-xl">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8 text-center">
        {routeCategory
          ? `Products in ${
              routeCategory.charAt(0).toUpperCase() + routeCategory.slice(1)
            }`
          : "Our Products"}
      </h1>

      {/* Filters Section */}
      <div className="mb-10 p-4 sm:p-6 bg-gray-100 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 items-end">
          {/* Search Input */}
          <div>
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Search Products
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search by name or description..."
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Category Filter */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              {allAvailableCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "all"
                    ? "All Categories"
                    : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Price Filter */}
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Price Range
            </label>
            <select
              id="price"
              value={selectedPriceRange.label}
              onChange={handlePriceChange}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              {priceRanges.map((range) => (
                <option key={range.label} value={range.label}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters Button */}
          <div>
            <button
              onClick={clearFilters}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md transition-colors duration-300"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-600 text-xl py-10">
          No products found matching your criteria.
        </div>
      )}
    </div>
  );
};

export default ShopPage;
