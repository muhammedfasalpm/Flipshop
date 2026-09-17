import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../component/ProductCard";
import { Search, PackageX, Sparkles, LayoutGrid, List, X, Tag, Filter, ArrowUpDown } from "lucide-react";
import { API_URL } from "../services/api";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get("search") || "";
  const selectedCategory = searchParams.get("category") || "All";

  const [search, setSearch] = useState(() => searchQuery);
  const [category, setCategory] = useState(() => selectedCategory);
  const [sort, setSort] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
  const [loading, setLoading] = useState(true);

  const availableCategoryPills = ["All", "Electronics", "Mobiles", "Fashion", "Audio", "Wearables"];

  const getProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/products/get`);
      setProducts(res.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const getCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/categories/get`);
      if (res.data && res.data.length > 0) {
        setCategories(res.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    getProducts();
    getCategories();
  }, []);


  const clearAllFilters = () => {
    setSearch("");
    setCategory("All");
    setSort("");
    setSearchParams({});
  };

  let filteredProducts = [...products];

  filteredProducts = filteredProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) &&
      (category === "All" || product.category?.toLowerCase() === category.toLowerCase())
  );

  if (sort === "lowToHigh") {
    filteredProducts.sort((a, b) => a.price - b.price);
  }

  if (sort === "highToLow") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

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
              Showing {filteredProducts.length} items with fast delivery & guaranteed quality.
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
          {availableCategoryPills.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
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

      {/* HORIZONTAL PRODUCT SEARCH CONTROLS BAR */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-800/90 border border-slate-700/60 shadow-xl backdrop-blur-xl flex flex-col md:flex-row items-center gap-4">
        
        {/* Keyword Search Input */}
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="Search products by name or brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-blue-500 transition-all shadow-inner"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          {search && (
            <button
              onClick={() => setSearch("")}
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
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 cursor-pointer appearance-none"
            >
              <option value="All">All Categories</option>
              {categories.length > 0
                ? categories.map((cat) => (
                    <option key={cat._id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))
                : [
                    <option key="e" value="Electronics">Electronics</option>,
                    <option key="m" value="Mobiles">Mobiles</option>,
                    <option key="f" value="Fashion">Fashion</option>,
                    <option key="a" value="Audio">Audio</option>,
                    <option key="w" value="Wearables">Wearables</option>
                  ]}
            </select>
            <Filter className="w-4 h-4 text-purple-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Horizontal Sort Dropdown */}
        <div className="w-full md:w-48 shrink-0">
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 cursor-pointer appearance-none"
            >
              <option value="">Sort: Featured</option>
              <option value="lowToHigh">Price: Low → High</option>
              <option value="highToLow">Price: High → Low</option>
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

      {/* Active Filter Chips */}
      {(search || category !== "All" || sort) && (
        <div className="flex flex-wrap items-center gap-2 bg-slate-800/60 px-5 py-2.5 rounded-2xl border border-slate-700/50 backdrop-blur-md text-xs">
          <span className="font-bold text-slate-400">Active Tags:</span>
          
          {search && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/20 border border-blue-500/40 text-blue-300 font-semibold">
              Search: "{search}"
              <button onClick={() => setSearch("")} className="hover:text-white"><X className="w-3 h-3" /></button>
            </span>
          )}

          {category !== "All" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-600/20 border border-purple-500/40 text-purple-300 font-semibold">
              Category: {category}
              <button onClick={() => setCategory("All")} className="hover:text-white"><X className="w-3 h-3" /></button>
            </span>
          )}

          {sort && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-600/20 border border-pink-500/40 text-pink-300 font-semibold">
              Sort: {sort === "lowToHigh" ? "Low → High" : "High → Low"}
              <button onClick={() => setSort("")} className="hover:text-white"><X className="w-3 h-3" /></button>
            </span>
          )}
        </div>
      )}

      {/* FULL-WIDTH PRODUCT RESULTS GRID */}
      <div>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-10 h-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
            <p className="text-slate-300 text-sm">Loading catalog items...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 bg-slate-800/60 rounded-3xl border border-slate-700/60 text-center">
            <PackageX className="w-12 h-12 text-purple-400 mb-3 animate-bounce" />
            <h3 className="text-xl font-bold text-white font-['Outfit']">No Products Found</h3>
            <p className="text-slate-300 text-sm mt-1 mb-6">
              We couldn't find any products matching "{search || category}".
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
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} viewMode="grid" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} viewMode="list" />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Products;

