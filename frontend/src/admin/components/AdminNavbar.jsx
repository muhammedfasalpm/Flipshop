import React, { useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, LogOut, Store, ShieldCheck, User } from "lucide-react";
import gsap from "gsap";

const AdminNavbar = ({ setMobileOpen }) => {
  const navigate = useNavigate();
  const navbarRef = useRef(null);

  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");

  useEffect(() => {
    if (navbarRef.current) {
      gsap.fromTo(
        navbarRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" }
      );
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  return (
    <header
      ref={navbarRef}
      className="sticky top-0 z-30 h-16 sm:h-20 bg-[#090d16]/90 backdrop-blur-xl border-b border-purple-900/40 px-4 sm:px-8 flex items-center justify-between gap-3 shrink-0"
    >
      {/* Left side: Hamburger Toggle & Portal Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2 rounded-xl bg-slate-900 border border-purple-500/30 text-slate-300 hover:text-white transition-colors"
          title="Open Menu"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="truncate">Authenticated Administrator Portal</span>
        </div>
      </div>

      {/* Right side: Back to Store, Profile, Logout */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Back to Store Link */}
        <Link
          to="/"
          className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-purple-500/30 text-purple-300 hover:text-white hover:border-purple-400 text-xs font-semibold transition-all shadow-sm"
          title="Go to Customer Store Homepage"
        >
          <Store className="w-4 h-4 text-purple-400 shrink-0" />
          <span className="hidden sm:inline">Back to Store</span>
        </Link>

        {/* User Profile Badge */}
        <div className="flex items-center gap-2 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-slate-900 border border-purple-500/30">
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white text-xs font-extrabold shadow shrink-0">
            {userInfo?.name ? userInfo.name.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5" />}
          </div>
          <span className="hidden sm:inline text-xs font-bold text-white max-w-[90px] truncate">
            {userInfo?.name || "Admin"}
          </span>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="p-2 sm:px-3 sm:py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white text-xs font-semibold transition-all flex items-center gap-1.5"
          title="Sign Out"
          aria-label="Logout"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default AdminNavbar;