import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Star, ShoppingCart, Heart, Eye, ArrowRight, ShieldCheck } from "lucide-react";

const ProductCard = ({ product, viewMode = "grid" }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Cart addition logic
  };

  const imageUrl = product.images?.length > 0
    ? (product.images[0].startsWith("http")
        ? product.images[0]
        : `http://localhost:4000/${product.images[0]}`)
    : "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop";

  if (viewMode === "list") {
    return (
      <div className="group relative bg-slate-800/90 rounded-3xl border border-slate-700/60 hover:border-blue-400 shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 overflow-hidden flex flex-col sm:flex-row gap-5 p-4 cursor-pointer backdrop-blur-md">
        
        {/* Left Image Section */}
        <div className="relative w-full sm:w-56 h-48 sm:h-44 shrink-0 bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center p-2 border border-slate-700/50">
          <button
            onClick={toggleWishlist}
            className="absolute top-2.5 right-2.5 z-10 p-2 rounded-full bg-slate-950/80 border border-white/10 text-slate-300 hover:text-red-400 hover:bg-slate-900 transition-all duration-200 backdrop-blur-md"
            title="Wishlist"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? "text-red-500 fill-red-500" : ""}`} />
          </button>

          {product?.rating && (
            <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-950/80 border border-amber-500/30 text-amber-400 text-xs font-semibold backdrop-blur-md">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
            </div>
          )}

          <Link to={`/product/${product._id}`} className="w-full h-full block">
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-xl"
            />
          </Link>
        </div>

        {/* Right Info Section */}
        <div className="flex-1 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold text-purple-300 uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/30">
                {product.category || "General"}
              </span>
              <span className="text-xs text-slate-300 font-medium">{product.brand || "FlipShop Collection"}</span>
            </div>

            <Link to={`/product/${product._id}`}>
              <h3 className="font-bold text-white text-lg group-hover:text-blue-300 transition-colors font-['Outfit']">
                {product.name}
              </h3>
            </Link>

            <p className="text-xs text-slate-300 line-clamp-2 mt-1.5 leading-relaxed">
              High-performance quality product with standard warranty and fast delivery across India.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-700/60">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-white font-['Outfit']">
                ₹{product.price?.toLocaleString() || "0"}
              </span>
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> In Stock
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to={`/product/${product._id}`}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white hover:border-blue-400 transition-all flex items-center gap-1"
              >
                <span>Details</span>
                <Eye className="w-3.5 h-3.5" />
              </Link>

              <button
                onClick={handleAddToCart}
                className="btn-primary-gradient px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-purple-600/20"
              >
                <ShoppingCart className="w-3.5 h-3.5 text-white" />
                <span>Add To Cart</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    );
  }

  // Grid View (Standard)
  return (
    <div className="group relative bg-slate-800/90 rounded-3xl border border-slate-700/60 hover:border-blue-400 shadow-lg hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer backdrop-blur-md">
      
      {/* Image Container with Crisp Fixed Height & Framing */}
      <div className="relative w-full h-60 sm:h-64 bg-slate-900 p-3 flex items-center justify-center overflow-hidden border-b border-slate-700/50">
        {/* Wishlist Heart Button */}
        <button
          onClick={toggleWishlist}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-slate-950/80 border border-white/10 text-slate-300 hover:text-red-400 hover:bg-slate-900 transition-all duration-200 backdrop-blur-md"
          title="Add to Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? "text-red-500 fill-red-500" : ""}`} />
        </button>

        {/* Rating Badge */}
        {product?.rating && (
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-950/80 border border-amber-500/30 text-amber-400 text-xs font-semibold backdrop-blur-md">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{product.rating}</span>
          </div>
        )}

        {/* Product Image */}
        <Link to={`/product/${product._id}`} className="w-full h-full block rounded-2xl overflow-hidden relative">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out opacity-90 group-hover:opacity-100 rounded-xl"
          />
        </Link>

        {/* Hover Quick View Button Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-3 pointer-events-none">
          <span className="text-xs text-blue-300 bg-slate-950/80 px-3 py-1.5 rounded-full border border-blue-500/30 font-semibold flex items-center gap-1 backdrop-blur-md">
            <Eye className="w-3.5 h-3.5 text-blue-400" /> Quick View
          </span>
        </div>
      </div>

      {/* Details Container */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-3">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-purple-300 uppercase tracking-wider">
              {product.brand || "FlipShop"}
            </span>
            {product.category && (
              <span className="text-[10px] text-slate-300 px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700">
                {product.category}
              </span>
            )}
          </div>

          <Link to={`/product/${product._id}`}>
            <h3 className="font-bold text-white text-base line-clamp-1 group-hover:text-blue-300 transition-colors font-['Outfit']">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-700/60 mt-auto">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-semibold text-slate-400">Price</span>
            <span className="text-lg font-extrabold text-white font-['Outfit'] tracking-tight">
              ₹{product.price?.toLocaleString() || "0"}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className="btn-primary-gradient px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-purple-600/20 active:scale-95 transition-transform"
          >
            <ShoppingCart className="w-3.5 h-3.5 text-white" />
            <span>Add</span>
          </button>
        </div>

      </div>

    </div>
  );
};

export default ProductCard;

