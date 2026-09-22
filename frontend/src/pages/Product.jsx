import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../component/ProductCard";
import { Search, PackageX, Sparkles, LayoutGrid, List, X, Tag, Filter, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import api from "../services/api";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get("search") || "";
  const selectedCategory = searchParams.get("category") || "All";

  const [search, setSearch] = useState(() => searchQuery);
  const [category, setCategory] = useState(() => selectedCategory);
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(12);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, totalPages: 1 });
  const [viewMode, setViewMode] = useState("grid");
  const [loading, setLoading] = useState(true);

  const categoryPillList = ["All", ...categories.map((c) => (typeof c === "string" ? c : c.name))];

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/products/get", {
        params: {
          search: search || undefined,
          category: category !== "All" ? category : undefined,
          sort: sort || undefined,
          page,
          limit,
        },
      });

      if (res.data && res.data.products) {
        setProducts(res.data.products);
        setPagination(res.data.pagination || { page, limit, total: res.data.products.length, totalPages: 1 });
      } else if (Array.isArray(res.data)) {
        setProducts(res.data);
        setPagination({ page: 1, limit: res.data.length, total: res.data.length, totalPages: 1 });
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products from API:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/api/categories/get");
      if (Array.isArray(res.data)) {
        setCategories(res.data);
      } else if (res.data && Array.isArray(res.data.categories)) {
        setCategories(res.data.categories);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category, sort, page]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setPage(1);
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
    setPage(1);
  };

  const clearAllFilters = () => {
    setSearch("");
    setCategory("All");
    setSort("");
    setPage(1);
    setSearchParams({});
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner & Quick Navigation */}
      <div className="p-6 sm:p-7 rounded-3xl bg-slate-800/80 border border-slate-700/60 backdrop-blur-xl shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider mb-1.5 border border-blue-500/30">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Premium Catalog
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit'] tracking-tight">
              {category === "All" ? "Explore All Products" : `${category} Collection`}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Showing {pagination.total || products.length} items from backend API.
            </p>
          </div>

          {/* View Mode Toggle Button */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-purple-500/30">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold ${
                viewMode === "grid"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Grid</span>
            </button>

            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold ${
                viewMode === "list"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-t border-slate-700/50 pt-4 scrollbar-none">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 shrink-0 mr-1">
            <Tag className="w-3.5 h-3.5 text-purple-400" /> Categories:
          </span>
          {categoryPillList.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                category.toLowerCase() === cat.toLowerCase()
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md border border-purple-400/40"
                  : "bg-slate-900/90 text-slate-300 border border-slate-700/60 hover:border-purple-500/40 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* HORIZONTAL PRODUCT SEARCH & API CONTROLS BAR */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-800/90 border border-slate-700/60 shadow-xl backdrop-blur-xl flex flex-col md:flex-row items-center gap-4">
        
        {/* Keyword Search Input */}
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="Search products via API backend..."
            value={search}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-blue-500 transition-all shadow-inner"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          {search && (
            <button
              onClick={() => { setSearch(""); setPage(1); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
              title="Clear Search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Horizontal Category Dropdown */}
        <div className="w-full md:w-48 shrink-0">
          <div className="relative">
            <select
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 cursor-pointer appearance-none"
            >
              <option value="All">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
            <Filter className="w-4 h-4 text-purple-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Horizontal Sort Dropdown */}
        <div className="w-full md:w-48 shrink-0">
          <div className="relative">
            <select
              value={sort}
              onChange={handleSortChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 cursor-pointer appearance-none"
            >
              <option value="">Sort: Featured</option>
              <option value="lowToHigh">Price: Low → High</option>
              <option value="highToLow">Price: High → Low</option>
              <option value="newest">Newest Arrivals</option>
              <option value="oldest">Oldest First</option>
            </select>
            <ArrowUpDown className="w-4 h-4 text-blue-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Clear Filters Button */}
        {(search || category !== "All" || sort) && (
          <button
            onClick={clearAllFilters}
            className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 hover:text-white hover:bg-purple-600 transition-all text-xs font-semibold flex items-center justify-center gap-1.5 whitespace-nowrap"
          >
            <X className="w-3.5 h-3.5" /> Clear Filters
          </button>
        )}

      </div>

      {/* FULL-WIDTH PRODUCT RESULTS GRID */}
      <div>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-10 h-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
            <p className="text-slate-300 text-sm">Loading catalog items from backend API...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 bg-slate-800/60 rounded-3xl border border-slate-700/60 text-center">
            <PackageX className="w-12 h-12 text-purple-400 mb-3 animate-bounce" />
            <h3 className="text-xl font-bold text-white font-['Outfit']">No Products Found</h3>
            <p className="text-slate-300 text-sm mt-1 mb-6">
              No products matched "{search || category}".
            </p>
            <button
              onClick={clearAllFilters}
              className="btn-primary-gradient px-5 py-2.5 rounded-xl font-semibold text-xs text-white"
            >
              Reset Search Filters
            </button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} viewMode="grid" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} viewMode="list" />
            ))}
          </div>
        )}
      </div>

      {/* BACKEND API PAGINATION CONTROLS */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 backdrop-blur-md text-sm text-slate-300 mt-6">
          <span>
            Page <strong className="text-white">{pagination.page}</strong> of <strong className="text-white">{pagination.totalPages}</strong> ({pagination.total} total items)
          </span>

          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-purple-500 disabled:opacity-40 disabled:hover:border-slate-700 transition-all flex items-center gap-1 text-xs font-semibold text-white"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>

            <button
              disabled={page >= pagination.totalPages}
              onClick={() => setPage((prev) => Math.min(prev + 1, pagination.totalPages))}
              className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-purple-500 disabled:opacity-40 disabled:hover:border-slate-700 transition-all flex items-center gap-1 text-xs font-semibold text-white"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Products;