import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { FiFilter, FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import ProductCard from "../components/ProductCard";
import { GetProducts } from "../Api";

const SearchPage = ({ darkMode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    totalProducts: 0,
  });
  
  const [filters, setFilters] = useState({
    sort: "newest",
    minPrice: "",
    maxPrice: "",
    category: "",
  });

  const getSearchParams = () => {
    const params = new URLSearchParams(location.search);
    return params.get("q") || "";
  };

  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    const q = getSearchParams();
    setKeyword(q);
    if (q) {
      fetchProducts(q, 1);
    } else {
      setProducts([]);
    }
  }, [location.search]);

  const fetchProducts = async (searchKeyword, page = 1, filterParams = filters) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await GetProducts(
        searchKeyword,
        page,
        20,
        filterParams.sort,
        filterParams.minPrice || undefined,
        filterParams.maxPrice || undefined,
        filterParams.category || undefined
      );
      
      if (response.data) {
        setProducts(response.data.products || []);
        setPagination({
          page: response.data.page || 1,
          pages: response.data.pages || 1,
          totalProducts: response.data.totalProducts || 0,
        });
      }
    } catch (err) {
      setError("Failed to fetch products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search?q=${encodeURIComponent(keyword.trim())}`);
      setFilters({ sort: "newest", minPrice: "", maxPrice: "", category: "" });
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    fetchProducts(keyword, 1, filters);
    setShowFilters(false);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      fetchProducts(keyword, newPage, filters);
    }
  };

  const clearFilters = () => {
    setFilters({ sort: "newest", minPrice: "", maxPrice: "", category: "" });
    fetchProducts(keyword, 1, { sort: "newest", minPrice: "", maxPrice: "", category: "" });
  };

  if (!keyword) {
    return (
      <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"} flex items-center justify-center`}>
        <div className="text-center">
          <h2 className={`text-2xl font-semibold ${darkMode ? "text-white" : "text-gray-800"} mb-4`}>
            Search Products
          </h2>
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Enter search keyword..."
              className={`px-4 py-2 rounded-lg border ${
                darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"} py-8`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className={`lg:w-1/4 ${showFilters ? "block" : "hidden lg:block"}`}>
            <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow p-6`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
                  Filters
                </h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-500 hover:text-blue-600"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-2`}>
                    Sort By
                  </label>
                  <select
                    value={filters.sort}
                    onChange={(e) => handleFilterChange("sort", e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    <option value="newest">Newest First</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-2`}>
                    Price Range
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-2`}>
                    Category
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Electronics"
                    value={filters.category}
                    onChange={(e) => handleFilterChange("category", e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>

                <button
                  onClick={applyFilters}
                  className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>

          {/* Search Results */}
          <div className="lg:w-3/4">
            {/* Search Bar */}
            <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow p-4 mb-6`}>
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Search products..."
                  className={`flex-1 px-4 py-2 rounded-lg border ${
                    darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`lg:hidden p-2 rounded-lg ${
                    darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"
                  }`}
                >
                  <FiFilter />
                </button>
              </form>
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between mb-4">
              <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                {loading ? "Searching..." : `${pagination.totalProducts} results for "${keyword}"`}
              </p>
            </div>

            {/* Loading/Error/Results */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-red-500">{error}</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <p className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                  No products found for "{keyword}"
                </p>
                <p className={`mt-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Try different keywords or adjust your filters
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} darkMode={darkMode} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex items-center justify-center mt-8 gap-2">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className={`p-2 rounded-lg ${
                        darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-700"
                      } disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-500 hover:text-white transition-colors`}
                    >
                      <FiChevronLeft />
                    </button>
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 rounded-lg ${
                          page === pagination.page
                            ? "bg-blue-500 text-white"
                            : darkMode
                            ? "bg-gray-700 text-white"
                            : "bg-white text-gray-700"
                        } hover:bg-blue-500 hover:text-white transition-colors`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.pages}
                      className={`p-2 rounded-lg ${
                        darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-700"
                      } disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-500 hover:text-white transition-colors`}
                    >
                      <FiChevronRight />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;