import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, Flame } from "lucide-react";
import api from "../services/api";

import HeroSlider from "../component/HeroBanner";
import CategorySection from "../component/CategorySection";
import ProductGrid from "../component/ProductGrid";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get("/api/products/get", { params: { limit: 50 } }),
        api.get("/api/categories/get"),
      ]);

      const productList = prodRes.data.products || (Array.isArray(prodRes.data) ? prodRes.data : []);
      setProducts(productList);

      const categoryList = Array.isArray(catRes.data)
        ? catRes.data
        : Array.isArray(catRes.data?.categories)
        ? catRes.data.categories
        : [];
      setCategories(categoryList);
    } catch (error) {
      console.error("Error fetching home data:", error);
      setProducts([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const productCategories = [
    ...new Set(products.map((p) => p.category).filter(Boolean)),
  ];

  return (
    <div className="space-y-10 pb-10">
      
      {/* Hero Banner */}
      <HeroSlider />

      {/* Categories from API */}
      <CategorySection categories={categories} />

      {/* Loading Skeleton Indicator */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin" />
          <p className="text-slate-400 text-sm font-medium animate-pulse">Loading curated products...</p>
        </div>
      )}

      {/* Featured Promo Strip */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900/60 via-purple-900/60 to-slate-900 border border-purple-500/30 p-8 sm:p-10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-md">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> Flash Deals of the Week
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
            Get Extra 20% Discount with Coupon <span className="gradient-text-purple-blue">"FLIP2026"</span>
          </h2>
          <p className="text-slate-300 text-sm max-w-xl">
            Limited period offer across top tech accessories, wearables & sound gear.
          </p>
        </div>
        <Link
          to="/products"
          className="btn-primary-gradient px-6 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 whitespace-nowrap shadow-lg shadow-purple-500/30"
        >
          <span>Claim Discount</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Category Wise Products */}
      {!loading &&
        productCategories.map((category) => {
          const categoryProducts = products.filter(
            (product) => product.category === category
          );

          if (categoryProducts.length === 0) return null;

          return (
            <section
              key={category}
              className="bg-[#0f172a]/60 rounded-3xl border border-purple-900/30 p-6 sm:p-8 backdrop-blur-md shadow-xl"
            >
              {/* Section Header */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white font-['Outfit'] flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    <span>{category}</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">Top rated items in {category}</p>
                </div>

                <Link
                  to={`/products?category=${encodeURIComponent(category)}`}
                  className="text-xs sm:text-sm font-semibold text-blue-400 hover:text-purple-300 transition-colors flex items-center gap-1 group"
                >
                  <span>Explore All</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Products Grid */}
              <ProductGrid products={categoryProducts.slice(0, 8)} />
            </section>
          );
        })}

    </div>
  );
};

export default Home;