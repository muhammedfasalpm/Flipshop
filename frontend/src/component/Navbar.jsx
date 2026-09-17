import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  ShoppingBag, 
  Search, 
  Heart, 
  ShoppingCart, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Sparkles,
  PackageCheck
} from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
    window.location.reload();
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Wishlist", path: "/wishlist", icon: Heart },
    { name: "Cart", path: "/cart", icon: ShoppingCart },
    { name: "Orders", path: "/orders", icon: PackageCheck },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#090d16]/85 border-b border-purple-900/40 text-slate-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">

          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2.5 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:scale-105 transition-transform duration-300">
              <ShoppingBag className="w-5.5 h-5.5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-extrabold tracking-tight font-['Outfit'] bg-gradient-to-r from-blue-400 via-purple-300 to-white bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
                Flip<span className="text-purple-400">Shop</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest text-blue-400 font-semibold flex items-center gap-1 -mt-1">
                <Sparkles className="w-2.5 h-2.5 text-purple-400 animate-pulse" /> Premium Store
              </span>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <form 
            onSubmit={handleSearchSubmit} 
            className="hidden md:flex flex-1 max-w-md relative"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search gadgets, fashion, gear..."
              className="w-full pl-11 pr-4 py-2.5 rounded-full bg-slate-900/80 border border-purple-500/20 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 text-sm transition-all duration-300 shadow-inner"
            />
            <Search className="w-4.5 h-4.5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <button 
              type="submit" 
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs font-semibold rounded-full transition-all shadow-md"
            >
              Search
            </button>
          </form>

          {/* Navigation Links - Desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive(link.path)
                      ? "bg-gradient-to-r from-blue-600/30 to-purple-600/30 text-white border border-purple-500/40 shadow-sm"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                  }`}
                >
                  {Icon && <Icon className={`w-4 h-4 ${isActive(link.path) ? "text-purple-400" : "text-slate-400"}`} />}
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            {userInfo ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/profile"
                  className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-900 border border-purple-500/30 hover:border-blue-400 transition-all group"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow">
                    {userInfo.name ? userInfo.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <span className="text-sm font-medium text-slate-200 group-hover:text-white max-w-[100px] truncate">
                    {userInfo.name}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white text-xs font-semibold transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl text-slate-200 hover:text-white hover:bg-slate-800/60 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn-primary-gradient px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-lg shadow-purple-600/30"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-900 border border-purple-500/30 text-slate-200 hover:text-white focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6 text-purple-400" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Search Input */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-purple-500/20 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-blue-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top.1/2 top-3" />
          </form>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-purple-900/40 bg-[#090d16]/95 backdrop-blur-2xl px-4 py-4 space-y-2 animate-fade-in">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                  isActive(link.path)
                    ? "bg-gradient-to-r from-blue-600/40 to-purple-600/40 text-white border border-purple-500/50"
                    : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                }`}
              >
                {Icon ? <Icon className="w-5 h-5 text-purple-400" /> : <User className="w-5 h-5 text-slate-400" />}
                <span>{link.name}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};

export default Navbar;