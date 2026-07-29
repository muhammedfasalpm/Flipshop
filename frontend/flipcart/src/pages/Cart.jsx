import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck, ShoppingCart } from "lucide-react";
import { API_URL, getImageUrl } from "../services/api";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");

  useEffect(() => {
    if (userInfo) {
      getCart();
    }
  }, []);

  const getCart = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/cart/${userInfo._id}`
      );
      setCart(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;

    try {
      await axios.put(`${API_URL}/api/cart/update/${productId}`, {
        userId: userInfo._id,
        quantity,
      });
      getCart();
    } catch (error) {
      console.log(error);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await axios.delete(`${API_URL}/api/cart/remove/${productId}`, {
        data: {
          userId: userInfo._id,
        },
      });
      getCart();
    } catch (error) {
      console.log(error);
    }
  };


  if (!userInfo) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-purple-600/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white font-['Outfit']">Sign In to View Cart</h2>
        <p className="text-slate-400 text-sm mt-1 mb-6">Please log in to manage your shopping cart items.</p>
        <Link to="/login" className="btn-primary-gradient px-6 py-3 rounded-xl font-semibold text-sm">
          Sign In Now
        </Link>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-[#0f172a]/60 rounded-3xl border border-purple-900/30 my-8 backdrop-blur-md">
        <div className="w-16 h-16 rounded-2xl bg-purple-600/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4 animate-float">
          <ShoppingCart className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white font-['Outfit']">Your Cart is Empty</h2>
        <p className="text-slate-400 text-sm mt-1 mb-6 max-w-sm">Looks like you haven't added any items to your cart yet.</p>
        <Link to="/products" className="btn-primary-gradient px-6 py-3 rounded-xl font-semibold text-sm flex items-center gap-2">
          <span>Start Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between p-6 rounded-3xl bg-[#0f172a]/80 border border-purple-900/30 backdrop-blur-md">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit'] flex items-center gap-3">
          <ShoppingCart className="w-7 h-7 text-purple-400" />
          <span>Shopping Cart ({cart.items.length})</span>
        </h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Products List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div
              key={item.product._id}
              className="bg-[#0f172a]/90 border border-purple-900/30 p-5 rounded-2xl flex flex-col sm:flex-row gap-5 items-center justify-between backdrop-blur-md shadow-lg"
            >
              <img
                src={getImageUrl(item.product?.images?.[0])}
                alt={item.product?.name || "Product"}
                className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-xl bg-slate-900 border border-slate-700/60"
              />


              <div className="flex-1 space-y-1 text-center sm:text-left">
                <h2 className="text-base font-bold text-white font-['Outfit']">{item.product.name}</h2>
                <p className="text-blue-400 font-extrabold text-lg">₹{item.price?.toLocaleString()}</p>

                <div className="flex items-center justify-center sm:justify-start gap-3 pt-2">
                  <div className="flex items-center rounded-xl bg-slate-900 border border-purple-500/30 p-1">
                    <button
                      onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                      className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      aria-label="Decrease"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 font-semibold text-sm text-white">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                      className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      aria-label="Increase"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.product._id)}
                    className="p-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white transition-all text-xs font-semibold flex items-center gap-1"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Remove</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-[#0f172a]/90 p-6 rounded-3xl border border-purple-900/40 shadow-xl h-fit space-y-6 backdrop-blur-md">
          <h2 className="text-xl font-bold text-white font-['Outfit'] border-b border-purple-900/30 pb-3">
            Order Summary
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-slate-300">
              <span>Subtotal</span>
              <span className="font-semibold text-white">₹{cart.totalPrice?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Shipping</span>
              <span className="text-emerald-400 font-semibold">FREE</span>
            </div>
            <div className="pt-3 border-t border-purple-900/30 flex justify-between text-base font-bold text-white">
              <span>Total Amount</span>
              <span className="text-xl text-blue-400 font-['Outfit']">₹{cart.totalPrice?.toLocaleString()}</span>
            </div>
          </div>

          <button
            onClick={() => navigate("/checkout")}
            className="w-full btn-primary-gradient py-3.5 rounded-xl font-semibold text-white text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 hover:shadow-blue-500/40"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 justify-center text-xs text-slate-400 pt-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Guaranteed Safe & Secure Checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

