import React from "react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-8">
        Admin Dashboard
      </h1>

      <div className="grid md:grid-cols-4 gap-6">

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-gray-500">
            Total Products
          </h2>
          <p className="text-3xl font-bold">
            120
          </p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-gray-500">
            Total Orders
          </h2>
          <p className="text-3xl font-bold">
            65
          </p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-gray-500">
            Total Users
          </h2>
          <p className="text-3xl font-bold">
            450
          </p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-gray-500">
            Revenue
          </h2>
          <p className="text-3xl font-bold">
            ₹1,50,000
          </p>
        </div>

      </div>

      <div className="mt-10 flex gap-4">

        <Link
          to="/admin/products"
          className="bg-blue-600 text-white px-5 py-3 rounded"
        >
          Manage Products
        </Link>

        <Link
          to="/admin/orders"
          className="bg-green-600 text-white px-5 py-3 rounded"
        >
          Manage Orders
        </Link>

        <Link
          to="/admin/users"
          className="bg-orange-500 text-white px-5 py-3 rounded"
        >
          Manage Users
        </Link>

      </div>
    </div>
  );
};

export default AdminDashboard;