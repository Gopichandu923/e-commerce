import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { GetProducts } from "../Api";

const SearchPage = ({ darkMode = false }) => {
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
      <div className="min-h-screen flex items-center justify-center py-20">
        <div className="text-center w-full">
          <span className="text-secondary font-label text-xs tracking-[0.2em] uppercase">
            Search
          </span>
          <h2 className="text-3xl font-headline font-bold text-[#041627] mt-3 mb-6 tracking-tight">
            Find Your Piece
          </h2>
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search products..."
              className="flex-1 px-4 py-3 rounded-lg bg-[#f5f3f4] border-0 font-body text-[#041627] focus:ring-2 focus:ring-[#735c00]/20 focus:outline-none"
            />
            <button
              type="submit"
              className="px-6 py-3 btn-gradient text-white font-label text-sm tracking-widest uppercase rounded-lg hover:opacity-90 transition-opacity"
            >
              Search
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="w-full px-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className={`lg:w-1/4 ${showFilters ? "block" : "hidden lg:block"}`}>
            <div className="bg-[#f5f3f4] rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-headline font-bold text-[#041627]">
                  Filters
                </h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-[#735c00] hover:text-[#574500] transition-colors font-label"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-label text-[#44474c] mb-2">
                    Sort By
                  </label>
                  <select
                    value={filters.sort}
                    onChange={(e) => handleFilterChange("sort", e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-white border-0 font-body text-[#041627]"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-label text-[#44474c] mb-2">
                    Price Range
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg bg-white border-0 font-body text-[#041627]"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg bg-white border-0 font-body text-[#041627]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-label text-[#44474c] mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Electronics"
                    value={filters.category}
                    onChange={(e) => handleFilterChange("category", e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-white border-0 font-body text-[#041627]"
                  />
                </div>

                <button
                  onClick={applyFilters}
                  className="w-full py-3 btn-gradient text-white font-label text-sm tracking-widest uppercase rounded-lg hover:opacity-90 transition-opacity"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>

          <div className="lg:w-3/4">
            <div className="bg-[#f5f3f4] rounded-xl p-4 mb-6">
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Search products..."
                  className="flex-1 px-4 py-3 rounded-lg bg-white border-0 font-body text-[#041627] focus:ring-2 focus:ring-[#735c00]/20 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-6 py-3 btn-gradient text-white font-label text-sm tracking-widest uppercase rounded-lg hover:opacity-90 transition-opacity"
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden p-3 rounded-lg bg-white text-[#041627]"
                >
                  <span className="material-symbols-outlined text-xl">filter_list</span>
                </button>
              </form>
            </div>

            <div className="flex items-center justify-between mb-6">
              <p className="text-[#44474c] font-body">
                {loading ? "Searching..." : `${pagination.totalProducts} results for "${keyword}"`}
              </p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#735c00]"></div>
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-[#ba1a1a] font-body">{error}</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 bg-[#f5f3f4] rounded-xl">
                <p className="text-lg text-[#041627] font-headline font-bold">
                  No products found for "{keyword}"
                </p>
                <p className="mt-2 text-[#44474c] font-body">
                  Try different keywords or adjust your filters
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {pagination.pages > 1 && (
                  <div className="flex items-center justify-center mt-12 gap-2">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="p-2 rounded-lg bg-[#f5f3f4] text-[#041627] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#e4e2e3] transition-colors"
                    >
                      <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 rounded-lg font-label text-sm transition-colors ${
                          page === pagination.page
                            ? "btn-gradient text-white"
                            : "bg-[#f5f3f4] text-[#041627] hover:bg-[#e4e2e3]"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.pages}
                      className="p-2 rounded-lg bg-[#f5f3f4] text-[#041627] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#e4e2e3] transition-colors"
                    >
                      <span className="material-symbols-outlined">chevron_right</span>
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