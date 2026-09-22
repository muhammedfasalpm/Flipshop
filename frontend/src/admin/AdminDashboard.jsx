import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  FolderKanban,
  Users,
  ShoppingBag,
  Clock,
  CheckCircle2,
  TrendingUp,
  PlusCircle,
  ArrowUpRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import gsap from "gsap";

import AdminLayout from "./components/AdminLayout";
import StatCard from "./components/StatCard";
import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";
import api from "../services/api";

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cardsContainerRef = useRef(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/api/dashboard");
      if (res.data) {
        setDashboard(res.data);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError(err.response?.data?.message || "Failed to load dashboard statistics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (!loading && dashboard && cardsContainerRef.current) {
      const cards = cardsContainerRef.current.querySelectorAll(".stat-card");
      if (cards.length > 0) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: "power2.out" }
        );
      }
    }
  }, [loading, dashboard]);

  const COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444"];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header Title Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white font-['Outfit'] tracking-tight">
              Executive Overview
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Live operational metrics & analytics from your MongoDB Atlas database.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/add-product"
              className="btn-primary-gradient px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-lg shadow-purple-600/30 hover:scale-105 transition-transform"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add New Product</span>
            </Link>
          </div>
        </div>

        {/* Loading State */}
        {loading && <LoadingState type="cards" count={4} />}

        {/* Error State */}
        {error && <ErrorState title="Dashboard Connection Error" message={error} onRetry={fetchDashboardData} />}

        {/* Metrics Grid & Charts */}
        {!loading && !error && dashboard && (
          <>
            {/* Stat Cards Grid */}
            <div ref={cardsContainerRef} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Revenue"
                value={`₹${(dashboard.totalRevenue || 0).toLocaleString()}`}
                icon={TrendingUp}
                color="emerald"
                trend="Live"
              />

              <StatCard
                title="Total Orders"
                value={dashboard.totalOrders || 0}
                icon={ShoppingBag}
                color="blue"
              />

              <StatCard
                title="Total Products"
                value={dashboard.totalProducts || 0}
                icon={Package}
                color="purple"
              />

              <StatCard
                title="Total Customers"
                value={dashboard.totalUsers || 0}
                icon={Users}
                color="amber"
              />
            </div>

            {/* Secondary Metric Bar */}
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="bg-[#0f172a] border border-purple-900/30 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase">Categories</span>
                  <h4 className="text-xl font-bold text-white font-['Outfit']">{dashboard.totalCategories || 0}</h4>
                </div>
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
                  <FolderKanban className="w-4.5 h-4.5" />
                </div>
              </div>

              <div className="bg-[#0f172a] border border-purple-900/30 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase">Pending Orders</span>
                  <h4 className="text-xl font-bold text-amber-400 font-['Outfit']">{dashboard.pendingOrders || 0}</h4>
                </div>
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                  <Clock className="w-4.5 h-4.5" />
                </div>
              </div>

              <div className="bg-[#0f172a] border border-purple-900/30 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase">Completed Deliveries</span>
                  <h4 className="text-xl font-bold text-emerald-400 font-['Outfit']">{dashboard.completedOrders || 0}</h4>
                </div>
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                  <CheckCircle2 className="w-4.5 h-4.5" />
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Monthly Revenue Chart */}
              <div className="bg-[#0f172a] border border-purple-900/40 rounded-3xl p-6 shadow-xl">
                <h3 className="text-lg font-bold text-white font-['Outfit'] mb-4 flex items-center justify-between">
                  <span>Revenue Trend</span>
                  <span className="text-xs text-slate-400 font-normal">Monthly Overview</span>
                </h3>

                {dashboard.monthlyData && dashboard.monthlyData.length > 0 ? (
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={dashboard.monthlyData}>
                        <defs>
                          <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 12 }} />
                        <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#090d16",
                            borderColor: "#334155",
                            borderRadius: "12px",
                            color: "#fff",
                          }}
                        />
                        <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-64 flex flex-col items-center justify-center text-slate-500 text-xs border border-dashed border-purple-900/30 rounded-2xl">
                    <span>No sales history recorded yet in database.</span>
                    <span className="text-[10px] mt-1 text-slate-600">New orders will populate this chart automatically.</span>
                  </div>
                )}
              </div>

              {/* Order Status Distribution Chart */}
              <div className="bg-[#0f172a] border border-purple-900/40 rounded-3xl p-6 shadow-xl">
                <h3 className="text-lg font-bold text-white font-['Outfit'] mb-4 flex items-center justify-between">
                  <span>Order Status Breakdown</span>
                  <span className="text-xs text-slate-400 font-normal">Distribution</span>
                </h3>

                {dashboard.statusDistribution && dashboard.statusDistribution.some(s => s.value > 0) ? (
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dashboard.statusDistribution}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 12 }} />
                        <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#090d16",
                            borderColor: "#334155",
                            borderRadius: "12px",
                            color: "#fff",
                          }}
                        />
                        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                          {dashboard.statusDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-64 flex flex-col items-center justify-center text-slate-500 text-xs border border-dashed border-purple-900/30 rounded-2xl">
                    <span>No order distribution data recorded yet.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Orders Snippet Table */}
            <div className="bg-[#0f172a] border border-purple-900/40 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white font-['Outfit']">Recent Orders</h3>
                  <p className="text-slate-400 text-xs mt-0.5">Latest customer transactions from database</p>
                </div>
                <Link
                  to="/admin/orders"
                  className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
                >
                  <span>View All Orders</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {dashboard.recentOrders && dashboard.recentOrders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-300">
                    <thead className="text-xs uppercase bg-slate-900/80 text-slate-400 border-b border-purple-900/30">
                      <tr>
                        <th className="py-3 px-4 rounded-l-xl">Order ID</th>
                        <th className="py-3 px-4">Customer</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Total</th>
                        <th className="py-3 px-4 rounded-r-xl">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-purple-900/20">
                      {dashboard.recentOrders.map((order) => (
                        <tr key={order._id} className="hover:bg-slate-900/40 transition-colors">
                          <td className="py-3 px-4 font-mono text-xs font-bold text-purple-400">
                            #{order._id.substring(order._id.length - 8)}
                          </td>
                          <td className="py-3 px-4">
                            {order.user?.name || "Customer"}
                          </td>
                          <td className="py-3 px-4 text-xs text-slate-400">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 font-semibold text-white">
                            ₹{order.totalPrice?.toLocaleString()}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                              order.orderStatus === "Delivered"
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                : order.orderStatus === "Cancelled"
                                ? "bg-red-500/10 text-red-400 border-red-500/30"
                                : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                            }`}>
                              {order.orderStatus || "Pending"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-8 text-center text-slate-500 text-xs border border-dashed border-purple-900/20 rounded-2xl">
                  No orders logged yet in Atlas database.
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;