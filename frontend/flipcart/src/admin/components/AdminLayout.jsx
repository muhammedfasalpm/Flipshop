import React from "react";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from  "./AdminNavbar";

const AdminLayout = ({ children }) => {
  return (
    <div className="flex">

      <AdminSidebar/>

      <div className="flex-1 bg-gray-100 min-h-screen">

        <AdminNavbar/>

        <div className="p-6">
          {children}
        </div>

      </div>

    </div>
  );
};

export default AdminLayout;