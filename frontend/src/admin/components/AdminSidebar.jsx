import React, { useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  FolderKanban,
  ShoppingBag,
  Users,
  Tag,
  X,
  Sparkles,
} from "lucide-react";
import gsap from "gsap";

const AdminSidebar = ({ mobileOpen, setMobileOpen }) => {
  const location = useLocation();
  const sidebarRef = useRef(null);
  const backdropRef = useRef(null);

  // Close drawer on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && mobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen, setMobileOpen]);

  // GSAP animation for mobile drawer and backdrop
  useEffect(() => {
    if (window.innerWidth < 1024) {
      if (mobileOpen) {
        if (backdropRef.current) {
          gsap.fromTo(
            backdropRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.25, ease: "power2.out" }
          );
        }
        if (sidebarRef.current) {
          gsap.fromTo(
            sidebarRef.current,
            { x: "-100%" },
            { x: "0%", duration: 0.3, ease: "power2.out" }
          );
        }
      }
    }
  }, [mobileOpen]);

  const navItems = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Products", path: "/admin/products", icon: Package },
    { name: "Add Product", path: "/admin/add-product", icon: PlusCircle },
    { name: "Categories", path: "/admin/categories", icon: FolderKanban },
    { name: "Orders", path: "/admin/orders", icon: ShoppingBag },
    { name: "Users", path: "/admin/users", icon: Users },
    { name: "Coupons", path: "/admin/coupons", icon: Tag },
  ];

  const isActive = (path) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Semi-transparent Backdrop Overlay for Mobile/Tablet */}
      {mobileOpen && (
        <div
          ref={backdropRef}
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden transition-opacity cursor-pointer"
          aria-hidden="true"
        />
      )}

      {/* Responsive Off-Canvas Sidebar / Drawer Viewport */}
      <aside
        ref={sidebarRef}
        aria-label="Admin Navigation Sidebar"
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-[#0a0f1d] border-r border-purple-900/40 text-slate-300 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="h-16 sm:h-20 px-6 border-b border-purple-900/30 flex items-center justify-between shrink-0">
            <Link
              to="/admin"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2.5 group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-purple-600/30 group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight font-['Outfit'] text-white">
                  Flip<span className="text-purple-400">Admin</span>
                </span>
                <span className="text-[9px] uppercase tracking-widest text-blue-400 font-semibold flex items-center gap-1 -mt-1">
                  <Sparkles className="w-2.5 h-2.5 text-purple-400" /> Control Panel
                </span>
              </div>
            </Link>

            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close Navigation Drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-140px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                    active
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-600/25 border border-purple-400/30"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/80 border border-transparent"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${active ? "text-white" : "text-slate-400"}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Info */}
        <div className="p-4 border-t border-purple-900/30 bg-slate-950/50 shrink-0">
          <div className="px-3 py-2 rounded-xl bg-slate-900/60 border border-purple-500/20 text-center">
            <p className="text-[11px] font-medium text-slate-400">System Environment</p>
            <p className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Atlas Connected
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;