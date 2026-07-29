import React from "react";
import { Link } from "react-router-dom";
import { 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  RefreshCw, 
  Headphones, 
  Send, 
  Heart,
  Globe,
  Share2,
  MessageSquare,
  Mail
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#060911] text-slate-300 border-t border-purple-900/40 mt-16">
      
      {/* Trust Highlights Section */}
      <div className="border-b border-purple-900/30 bg-[#090d16]/90 py-8 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/50 border border-white/5 backdrop-blur-md">
            <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm font-['Outfit']">Free Express Shipping</h4>
              <p className="text-xs text-slate-400 mt-0.5">On all orders over ₹499</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/50 border border-white/5 backdrop-blur-md">
            <div className="w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm font-['Outfit']">100% Secure Checkout</h4>
              <p className="text-xs text-slate-400 mt-0.5">Encrypted payment gateways</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/50 border border-white/5 backdrop-blur-md">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm font-['Outfit']">Hassle-Free Returns</h4>
              <p className="text-xs text-slate-400 mt-0.5">7 days money back guarantee</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/50 border border-white/5 backdrop-blur-md">
            <div className="w-12 h-12 rounded-xl bg-pink-600/20 border border-pink-500/30 flex items-center justify-center text-pink-400">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm font-['Outfit']">24/7 VIP Customer Care</h4>
              <p className="text-xs text-slate-400 mt-0.5">Instant live chat support</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold font-['Outfit'] bg-gradient-to-r from-blue-400 via-purple-300 to-white bg-clip-text text-transparent">
                Flip<span className="text-purple-400">Shop</span>
              </span>
            </Link>

            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Your premier destination for high-performance tech gadgets, modern apparel, and standard luxury lifestyle essentials.
            </p>

            {/* Newsletter Input */}
            <div className="pt-2">
              <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Subscribe to Secret Deals</h5>
              <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-2.5 rounded-xl bg-slate-900 border border-purple-500/30 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 flex-1"
                />
                <button
                  type="submit"
                  className="btn-primary-gradient p-2.5 rounded-xl text-white hover:opacity-90 transition-opacity"
                  title="Subscribe"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white text-base mb-4 font-['Outfit']">SHOP CATEGORIES</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link to="/products?category=electronics" className="hover:text-purple-400 transition-colors">Electronics & Gadgets</Link></li>
              <li><Link to="/products?category=fashion" className="hover:text-purple-400 transition-colors">Men & Women Fashion</Link></li>
              <li><Link to="/products?category=mobiles" className="hover:text-purple-400 transition-colors">Smartphones & Tablets</Link></li>
              <li><Link to="/products?category=audio" className="hover:text-purple-400 transition-colors">Headphones & Speakers</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-bold text-white text-base mb-4 font-['Outfit']">CUSTOMER SERVICE</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link to="/orders" className="hover:text-purple-400 transition-colors">Track Orders</Link></li>
              <li><Link to="/profile" className="hover:text-purple-400 transition-colors">Account Dashboard</Link></li>
              <li><Link to="/wishlist" className="hover:text-purple-400 transition-colors">Saved Wishlist</Link></li>
              <li><Link to="/cart" className="hover:text-purple-400 transition-colors">Shopping Cart</Link></li>
            </ul>
          </div>

          {/* Company & Social */}
          <div>
            <h4 className="font-bold text-white text-base mb-4 font-['Outfit'] font-bold">CONNECT WITH US</h4>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Stay connected across all social networks for weekly giveaways and tech updates.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" title="Global Network" className="w-9 h-9 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-slate-400 hover:text-blue-400 hover:border-blue-500/50 transition-all">
                <Globe className="w-4.5 h-4.5" />
              </a>
              <a href="#" title="Community Chat" className="w-9 h-9 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-slate-400 hover:text-purple-400 hover:border-purple-500/50 transition-all">
                <MessageSquare className="w-4.5 h-4.5" />
              </a>
              <a href="#" title="Social Share" className="w-9 h-9 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-slate-400 hover:text-pink-400 hover:border-pink-400/50 transition-all">
                <Share2 className="w-4.5 h-4.5" />
              </a>
              <a href="#" title="Direct Support Email" className="w-9 h-9 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-500/50 transition-all">
                <Mail className="w-4.5 h-4.5" />
              </a>
            </div>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 FlipShop. All rights reserved. Crafted with standard precision.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Security</a>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;