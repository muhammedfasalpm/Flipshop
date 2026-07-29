import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "./components/AdminLayout";
import { API_URL } from "../services/api";

const AdminDashboard = () => {

  const [dashboard, setDashboard] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    getDashboardData();
  }, []);

  const getDashboardData = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/dashboard`
      );

      setDashboard(res.data);


    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AdminLayout>

      <h1 className="text-3xl font-bold mb-8">
        Admin Dashboard
      </h1>

      <div className="grid md:grid-cols-4 gap-6">

        <div className="bg-white p-6 rounded shadow">
          <h2>Total Products</h2>
          <p className="text-3xl font-bold text-blue-600">
            {dashboard.totalProducts}
          </p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2>Total Orders</h2>
          <p className="text-3xl font-bold text-green-600">
            {dashboard.totalOrders}
          </p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2>Total Users</h2>
          <p className="text-3xl font-bold text-purple-600">
            {dashboard.totalUsers}
          </p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2>Total Revenue</h2>
          <p className="text-3xl font-bold text-red-600">
            ₹{dashboard.totalRevenue}
          </p>
        </div>

      </div>

    </AdminLayout>
  );
};

export default AdminDashboard;