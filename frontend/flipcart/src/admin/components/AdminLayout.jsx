import React from "react";
import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">

      {/* Fixed Sidebar */}
      <AdminSidebar />

      {/* Right Side */}
      <div className="ml-64">

        {/* Navbar */}
        <AdminNavbar />

        {/* Page Content */}
        <div className="p-6">
          {children}
        </div>

      </div>

    </div>
  );
};

export default AdminLayout;