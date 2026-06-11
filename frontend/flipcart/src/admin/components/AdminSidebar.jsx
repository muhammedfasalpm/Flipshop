import React from "react";
import { Link } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-5">

      <h1 className="text-2xl font-bold mb-10">
        Admin Panel
      </h1>

      <div className="flex flex-col gap-4">

        <Link to="/admin">Dashboard</Link>

        <Link to="/admin/products">
          Products
        </Link>

        <Link to="/admin/add-product">
          Add Product
        </Link>

        <Link to="/admin/orders">
          Orders
        </Link>

        <Link to="/admin/users">
          Users
        </Link>

        <Link to="/admin/categories">
          Categories
        </Link>

        <Link to="/admin/coupons">
          Coupons
        </Link>

      </div>

    </div>
  );
};

export default AdminSidebar;