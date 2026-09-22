import React, { useState, useRef, useEffect } from "react";
import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";
import gsap from "gsap";

const AdminLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const mainRef = useRef(null);

  useEffect(() => {
    if (mainRef.current) {
      gsap.fromTo(
        mainRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans overflow-x-hidden">
      {/* Responsive Sidebar Drawer & Backdrop */}
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Workspace Column */}
      <div className="lg:pl-64 flex flex-col min-h-screen w-full min-w-0 transition-all duration-300">
        {/* Top Admin Navbar */}
        <AdminNavbar setMobileOpen={setMobileOpen} />

        {/* Page Container */}
        <main ref={mainRef} className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1400px] w-full mx-auto min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;