import React from "react";
import { Link } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <div className="fixed top-0 left-0 w-64 h-screen bg-slate-900 text-white p-5 overflow-y-auto">

      <h1 className="text-3xl font-bold mb-10">
        Admin Panel
      </h1>

      <div className="space-y-5">

        <Link
          to="/admin"
          className="block hover:text-blue-400"
        >
          Dashboard
        </Link>

        <Link
          to="/admin/products"
          className="block hover:text-blue-400"
        >
          Products
        </Link>

        <Link
          to="/admin/add-product"
          className="block hover:text-blue-400"
        >
          Add Product
        </Link>

        <Link
          to="/admin/orders"
          className="block hover:text-blue-400"
        >
          Orders
        </Link>

        <Link
          to="/admin/users"
          className="block hover:text-blue-400"
        >
          Users
        </Link>

        <Link
          to="/admin/categories"
          className="block hover:text-blue-400"
        >
          Categories
        </Link>

        <Link
          to="/admin/coupons"
          className="block hover:text-blue-400"
        >
          Coupons
        </Link>

      </div>

    </div>
  );
};

export default AdminSidebar;