
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import { API_URL, getImageUrl } from "../services/api";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const userInfo = JSON.parse(
    localStorage.getItem("userInfo") || "null"
  );

  useEffect(() => {
    if (userInfo) {
      getWishlist();
    } else {
      setLoading(false);
    }
  }, []);

  const getWishlist = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/wishlist/${userInfo._id}`
      );
      setWishlist(res.data.products || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await axios.delete(
        `${API_URL}/api/wishlist/remove/${productId}`,
        {
          data: {
            userId: userInfo._id,
          },
        }
      );
      getWishlist();
    } catch (error) {
      console.log(error);
    }
  };

  const addToCart = async (productId) => {
    try {
      await axios.post(
        `${API_URL}/api/cart/add`,
        {
          userId: userInfo._id,
          productId,
          quantity: 1,
        }
      );
      alert("Added to cart");
    } catch (error) {
      console.log(error);
    }
  };

  if (!userInfo) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-purple-600/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4">
          <Heart className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white font-['Outfit']">Sign In to View Wishlist</h2>
        <p className="text-slate-400 text-sm mt-1 mb-6">Please log in to manage your saved items.</p>
        <Link to="/login" className="btn-primary-gradient px-6 py-3 rounded-xl font-semibold text-sm">
          Sign In Now
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between p-6 sm:p-8 rounded-3xl bg-slate-800/80 border border-slate-700/60 backdrop-blur-md">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit'] flex items-center gap-3">
            <Heart className="w-7 h-7 text-pink-500 fill-pink-500" />
            <span>My Wishlist ({wishlist.length})</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">Your saved favorite items in one place.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
        </div>
      ) : wishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-slate-800/60 rounded-3xl border border-slate-700/60 backdrop-blur-md">
          <Heart className="w-12 h-12 text-slate-500 mb-3" />
          <h3 className="text-xl font-bold text-white font-['Outfit']">Your Wishlist is Empty</h3>
          <p className="text-slate-400 text-sm mt-1 mb-6">Save products you love to view them later.</p>
          <Link to="/products" className="btn-primary-gradient px-6 py-3 rounded-xl font-semibold text-sm flex items-center gap-2">
            <span>Explore Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {wishlist.map((product) => (
            <div
              key={product._id}
              className="bg-slate-800/90 rounded-3xl border border-slate-700/60 p-5 flex flex-col justify-between backdrop-blur-md shadow-xl"
            >
              <div className="space-y-3">
                <div className="relative w-full h-56 rounded-2xl overflow-hidden bg-slate-900 border border-slate-700/50">
                  <img
                    src={getImageUrl(product.images?.[0])}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <h2 className="text-base font-bold text-white line-clamp-1 font-['Outfit']">
                  {product.name}
                </h2>

                <p className="text-blue-400 font-extrabold text-lg">
                  ₹{product.price?.toLocaleString()}
                </p>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-700/60 mt-4">
                <button
                  onClick={() => addToCart(product._id)}
                  className="flex-1 btn-primary-gradient py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-purple-600/20"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Add To Cart</span>
                </button>

                <button
                  onClick={() => removeFromWishlist(product._id)}
                  className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white transition-all text-xs font-semibold flex items-center justify-center"
                  title="Remove from Wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;


