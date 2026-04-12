import React, { useState, useEffect, useCallback } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import { GetAllCategories, GetAllProducts, GetProductsByCategory } from "../Api.js";

const priceRanges = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "$0 - $50", min: 0, max: 50 },
  { label: "$50 - $100", min: 50, max: 100 },
  { label: "$100 - $250", min: 100, max: 250 },
  { label: "$250+", min: 250, max: Infinity },
];

const ShopPage = ({ darkMode = false }) => {
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
        const { data } = await GetAllCategories();

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
        let response;
        if (routeCategory) {
          const category = routeCategory.toLowerCase().replace(/-/g, ' ');
          response = await GetProductsByCategory(category);
          setSelectedCategory(routeCategory.toLowerCase());
        } else {
          const queryParams = new URLSearchParams(location.search);
          const queryCategory = queryParams.get("category");
          if (queryCategory) {
            response = await GetProductsByCategory(queryCategory.toLowerCase());
            setSelectedCategory(queryCategory.toLowerCase());
          } else {
            response = await GetAllProducts();
            setSelectedCategory("all");
          }
        }
        setProducts(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError(err.response?.data?.message || err.message || "Failed to load products.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [routeCategory, location.search]);

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
      <div className="container mx-auto p-4 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#735c00]"></div>
        <p className="mt-4 text-[#44474c] font-body">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center text-[#ba1a1a]">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="space-y-2 mb-10">
        <span className="text-secondary font-label text-xs tracking-[0.2em] uppercase">
          Collection
        </span>
        <h1 className="text-4xl sm:text-5xl font-headline font-bold tracking-tighter text-primary text-center">
          {routeCategory
            ? routeCategory.charAt(0).toUpperCase() + routeCategory.slice(1)
            : "All Products"}
        </h1>
      </div>

      <div className="bg-[#f5f3f4] rounded-xl p-6 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 items-end">
          <div>
            <label
              htmlFor="search"
              className="block text-sm font-label text-[#44474c] mb-2"
            >
              Search Products
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search by name..."
              className="w-full p-2.5 bg-white border-0 rounded-lg font-body focus:ring-2 focus:ring-[#735c00]/20 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-label text-[#44474c] mb-2"
            >
              Category
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="w-full p-2.5 bg-white border-0 rounded-lg font-body focus:ring-2 focus:ring-[#735c00]/20 focus:outline-none"
            >
              {allAvailableCategories.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat === "all"
                    ? "All Categories"
                    : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="price"
              className="block text-sm font-label text-[#44474c] mb-2"
            >
              Price Range
            </label>
            <select
              id="price"
              value={selectedPriceRange.label}
              onChange={handlePriceChange}
              className="w-full p-2.5 bg-white border-0 rounded-lg font-body focus:ring-2 focus:ring-[#735c00]/20 focus:outline-none"
            >
              {priceRanges.map((range) => (
                <option key={range.label} value={range.label}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <button
              onClick={clearFilters}
              className="w-full bg-white hover:bg-[#e4e2e3] text-[#041627] py-2.5 px-4 rounded-lg font-label text-sm transition-colors duration-300"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center text-[#44474c] text-xl py-10 font-body">
          No products found matching your criteria.
        </div>
      )}
    </div>
  );
};

export default ShopPage;
