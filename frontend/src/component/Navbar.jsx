import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
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
  PackageCheck,
  ShieldCheck,
  Home,
  Package
} from "lucide-react";
import gsap from "gsap";
import { selectCartItemCount, resetHydration } from "../store/cartSlice";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const cartItemCount = useSelector(selectCartItemCount);

  const drawerRef = useRef(null);
  const backdropRef = useRef(null);

  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  // Close drawer on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen]);

  // GSAP animation for mobile overlay drawer and backdrop
  useEffect(() => {
    if (isMobileMenuOpen) {
      if (backdropRef.current) {
        gsap.fromTo(
          backdropRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.25, ease: "power2.out" }
        );
      }
      if (drawerRef.current) {
        gsap.fromTo(
          drawerRef.current,
          { x: "-100%" },
          { x: "0%", duration: 0.3, ease: "power2.out" }
        );
      }
    }
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    dispatch(resetHydration());
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { name: "Home", path: "/", icon: Home },
    { name: "Products", path: "/products", icon: Package },
    { name: "Wishlist", path: "/wishlist", icon: Heart },
    { name: "Cart", path: "/cart", icon: ShoppingCart },
    { name: "Orders", path: "/orders", icon: PackageCheck },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#090d16]/90 border-b border-purple-900/40 text-slate-100 transition-all duration-300">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-3 sm:gap-4">

          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 group cursor-pointer shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-purple-600 to-indigo-500 flex items-center justify-center shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform duration-300">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight font-['Outfit'] bg-gradient-to-r from-blue-400 via-purple-300 to-white bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
                Flip<span className="text-purple-400">Shop</span>
              </span>
              <span className="text-[9px] uppercase tracking-widest text-blue-400 font-semibold flex items-center gap-1 -mt-1 hidden sm:flex">
                <Sparkles className="w-2.5 h-2.5 text-purple-400 animate-pulse" /> Premium Store
              </span>
            </div>
          </Link>

          {/* Compact Search Bar - Desktop & Tablet */}
          <form 
            onSubmit={handleSearchSubmit} 
            className="hidden md:flex relative w-44 lg:w-64 transition-all duration-300"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-7 py-1.5 rounded-full bg-slate-900/90 border border-purple-500/25 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 text-xs transition-all duration-300 shadow-inner"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button 
                type="submit" 
                className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-purple-400 hover:text-white"
                title="Search"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Navigation Links - Desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isCart = link.path === "/cart";

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 relative ${
                    isActive(link.path)
                      ? "bg-gradient-to-r from-blue-600/30 to-purple-600/30 text-white border border-purple-500/40 shadow-sm"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                  }`}
                >
                  {Icon && <Icon className={`w-3.5 h-3.5 ${isActive(link.path) ? "text-purple-400" : "text-slate-400"}`} />}
                  <span>{link.name}</span>
                  {isCart && cartItemCount > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white bg-gradient-to-r from-purple-500 to-blue-500 rounded-full shadow-sm animate-pulse">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {userInfo ? (
              <div className="flex items-center gap-2 sm:gap-2.5">
                {/* Admin Shield Icon Button */}
                {userInfo.role === "admin" && (
                  <Link
                    to="/admin"
                    title="Admin Panel"
                    aria-label="Admin Panel"
                    className="p-2 rounded-xl bg-purple-600/20 border border-purple-500/40 text-purple-300 hover:bg-purple-600 hover:text-white transition-all shadow-sm flex items-center justify-center cursor-pointer group"
                  >
                    <ShieldCheck className="w-4.5 h-4.5 text-purple-400 group-hover:text-white transition-colors" />
                    <span className="sr-only">Admin Panel</span>
                  </Link>
                )}

                {/* Profile Badge */}
                <Link
                  to="/profile"
                  title="Profile"
                  className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900 border border-purple-500/30 hover:border-blue-400 transition-all group"
                >
                  <div className="w-6.5 h-6.5 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    {userInfo.name ? userInfo.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <span className="hidden sm:inline text-xs font-semibold text-slate-200 group-hover:text-white max-w-[90px] truncate">
                    {userInfo.name}
                  </span>
                </Link>

                {/* Compact Logout Icon Button */}
                <button
                  onClick={handleLogout}
                  title="Logout"
                  aria-label="Logout"
                  className="p-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-200 flex items-center justify-center cursor-pointer"
                >
                  <LogOut className="w-4.5 h-4.5" />
                  <span className="sr-only">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-xl text-slate-200 hover:text-white hover:bg-slate-800/60 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn-primary-gradient px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-purple-600/30"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-900 border border-purple-500/30 text-slate-200 hover:text-white focus:outline-none cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-purple-400" /> : <Menu className="w-5 h-5" />}
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
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-purple-500/20 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-blue-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </form>
        </div>

      </div>

      {/* Mobile Semi-transparent Backdrop Overlay */}
      {isMobileMenuOpen && (
        <div
          ref={backdropRef}
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden cursor-pointer"
          aria-hidden="true"
        />
      )}

      {/* Mobile Off-Canvas Fixed Overlay Drawer */}
      {isMobileMenuOpen && (
        <aside
          ref={drawerRef}
          aria-label="Mobile Navigation Menu"
          className="fixed top-0 left-0 z-50 h-screen w-72 sm:w-80 bg-[#0a0f1d] border-r border-purple-900/40 text-slate-100 flex flex-col justify-between shadow-2xl lg:hidden"
        >
          {/* Drawer Header */}
          <div className="h-16 px-5 border-b border-purple-900/30 flex items-center justify-between shrink-0">
            <Link 
              to="/" 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-md">
                <ShoppingBag className="w-4.5 h-4.5" />
              </div>
              <span className="text-lg font-extrabold tracking-tight font-['Outfit'] text-white">
                Flip<span className="text-purple-400">Shop</span>
              </span>
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close Navigation Menu"
            >
              <X className="w-5 h-5 text-purple-400" />
            </button>
          </div>

          {/* Navigation Items List */}
          <div className="p-4 space-y-1.5 flex-1 overflow-y-auto">
            {/* Admin Control Panel (Admin Users Only) */}
            {userInfo?.role === "admin" && (
              <Link
                to="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-purple-600/20 text-purple-300 border border-purple-500/40 hover:bg-purple-600 hover:text-white transition-all mb-3 shadow-sm"
              >
                <ShieldCheck className="w-4.5 h-4.5 text-purple-400" />
                <span>🛡 Admin Control Panel</span>
              </Link>
            )}

            {/* Main Store Navigation Links */}
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              const isCart = link.path === "/cart";

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    active
                      ? "bg-gradient-to-r from-blue-600/40 to-purple-600/40 text-white border border-purple-500/50 font-bold shadow-md"
                      : "text-slate-300 hover:bg-slate-800/60 hover:text-white border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${active ? "text-purple-400" : "text-slate-400"}`} />
                    <span>{link.name}</span>
                  </div>
                  {isCart && cartItemCount > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-bold leading-none text-white bg-gradient-to-r from-purple-500 to-blue-500 rounded-full shadow-sm">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Drawer Footer (User Profile Info & Logout) */}
          <div className="p-4 border-t border-purple-900/30 bg-slate-950/60 shrink-0 space-y-2">
            {userInfo ? (
              <>
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-900 border border-purple-500/20">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white text-xs font-extrabold shrink-0">
                    {userInfo.name ? userInfo.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-semibold text-white truncate">{userInfo.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{userInfo.email || userInfo.phone}</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2 text-center text-xs font-semibold rounded-xl text-slate-200 bg-slate-900 border border-purple-500/30 hover:text-white"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="btn-primary-gradient px-3 py-2 text-center text-xs font-semibold rounded-xl text-white shadow"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </aside>
      )}
    </header>
  );
};

export default Navbar;