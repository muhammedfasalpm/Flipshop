import React, { useEffect, useState, useRef } from "react";
import {
  Tag,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Lock,
  Unlock,
  Calendar,
  Percent,
  DollarSign,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import gsap from "gsap";

import AdminLayout from "./components/AdminLayout";
import Pagination from "./components/Pagination";
import LoadingState from "./components/LoadingState";
import EmptyState from "./components/EmptyState";
import ErrorState from "./components/ErrorState";
import Modal from "./components/Modal";
import NotificationToast from "./components/NotificationToast";
import api from "../services/api";

const ManageCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sort, setSort] = useState("createdAt_desc");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal & Form State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    minOrderValue: "",
    maxDiscount: "",
    startDate: new Date().toISOString().split("T")[0],
    expiryDate: "",
    usageLimit: "100",
    isActive: true,
  });

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState(null);
  const [toast, setToast] = useState(null);

  const tableRef = useRef(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const getCoupons = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/api/coupons", {
        params: {
          search: search || undefined,
          status: statusFilter !== "all" ? statusFilter : undefined,
          discountType: typeFilter !== "all" ? typeFilter : undefined,
          sort: sort || undefined,
          page,
          limit: 10,
        },
      });

      if (res.data && res.data.coupons) {
        setCoupons(res.data.coupons);
        setPagination(
          res.data.pagination || { page: 1, limit: 10, total: res.data.coupons.length, totalPages: 1 }
        );
      } else {
        setCoupons([]);
      }
    } catch (err) {
      console.error("Error fetching coupons:", err);
      setError(err.response?.data?.message || "Failed to load coupons from database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCoupons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, statusFilter, typeFilter, sort, page]);

  useEffect(() => {
    if (!loading && coupons.length > 0 && tableRef.current) {
      const rows = tableRef.current.querySelectorAll("tr");
      if (rows.length > 0) {
        gsap.fromTo(
          rows,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.3, stagger: 0.04, ease: "power2.out" }
        );
      }
    }
  }, [loading, coupons]);

  const openCreateModal = () => {
    setEditingCoupon(null);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 30);

    setFormData({
      code: "",
      discountType: "percentage",
      discountValue: "",
      minOrderValue: "0",
      maxDiscount: "0",
      startDate: new Date().toISOString().split("T")[0],
      expiryDate: tomorrow.toISOString().split("T")[0],
      usageLimit: "100",
      isActive: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      discountType: coupon.discountType || "percentage",
      discountValue: coupon.discountValue || "",
      minOrderValue: coupon.minOrderValue || "0",
      maxDiscount: coupon.maxDiscount || "0",
      startDate: coupon.startDate ? new Date(coupon.startDate).toISOString().split("T")[0] : "",
      expiryDate: coupon.expiryDate ? new Date(coupon.expiryDate).toISOString().split("T")[0] : "",
      usageLimit: coupon.usageLimit || "100",
      isActive: coupon.isActive !== undefined ? coupon.isActive : true,
    });
    setModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!formData.code || !formData.discountValue || !formData.expiryDate) {
      showToast("Please fill all required fields", "error");
      return;
    }

    if (formData.discountType === "percentage" && Number(formData.discountValue) > 100) {
      showToast("Percentage discount cannot exceed 100%", "error");
      return;
    }

    if (new Date(formData.expiryDate) <= new Date(formData.startDate)) {
      showToast("Expiry date must be after start date", "error");
      return;
    }

    try {
      if (editingCoupon) {
        await api.put(`/api/coupons/${editingCoupon._id}`, formData);
        showToast("Coupon updated successfully", "success");
      } else {
        await api.post("/api/coupons", formData);
        showToast("Coupon created successfully", "success");
      }

      setModalOpen(false);
      getCoupons();
    } catch (err) {
      console.error("Save coupon error:", err);
      showToast(err.response?.data?.message || "Failed to save coupon", "error");
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const res = await api.put(`/api/coupons/${id}/toggle`);
      showToast(res.data?.message || "Coupon status toggled", "success");
      getCoupons();
    } catch (err) {
      console.error("Toggle coupon error:", err);
      showToast(err.response?.data?.message || "Failed to toggle status", "error");
    }
  };

  const confirmDelete = (coupon) => {
    setCouponToDelete(coupon);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!couponToDelete) return;

    try {
      await api.delete(`/api/coupons/${couponToDelete._id}`);
      showToast("Coupon deleted successfully", "success");
      setDeleteModalOpen(false);
      setCouponToDelete(null);
      getCoupons();
    } catch (err) {
      console.error("Delete coupon error:", err);
      showToast(err.response?.data?.message || "Failed to delete coupon", "error");
    }
  };

  const getCalculatedStatus = (coupon) => {
    if (!coupon.isActive) {
      return { label: "Disabled", color: "bg-red-500/10 text-red-400 border-red-500/30", icon: Lock };
    }
    const now = new Date();
    const expiry = new Date(coupon.expiryDate);
    const start = new Date(coupon.startDate);

    if (now > expiry) {
      return { label: "Expired", color: "bg-amber-500/10 text-amber-400 border-amber-500/30", icon: AlertCircle };
    }
    if (now < start) {
      return { label: "Scheduled", color: "bg-blue-500/10 text-blue-400 border-blue-500/30", icon: Clock };
    }
    return { label: "Active", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30", icon: CheckCircle2 };
  };

  return (
    <AdminLayout>
      <NotificationToast toast={toast} onClose={() => setToast(null)} />

      <div className="space-y-6">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white font-['Outfit'] tracking-tight">
              Coupons Management
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Create promotional discount codes and manage active customer offers in MongoDB Atlas.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="btn-primary-gradient px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg shadow-purple-600/30 hover:scale-105 transition-transform self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4.5 h-4.5" />
            <span>Create Coupon</span>
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-[#0f172a] border border-purple-900/40 rounded-3xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search by Coupon Code..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-purple-500/30 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition-all uppercase"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Status Filter */}
            <div className="relative flex-1 md:flex-initial">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full md:w-40 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-purple-500/30 text-white text-xs font-semibold focus:outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer pr-8"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="disabled">Disabled</option>
                <option value="scheduled">Scheduled</option>
              </select>
              <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Type Filter */}
            <div className="relative flex-1 md:flex-initial">
              <select
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full md:w-40 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-purple-500/30 text-white text-xs font-semibold focus:outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer pr-8"
              >
                <option value="all">All Types</option>
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₹)</option>
              </select>
              <Tag className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Sort Order */}
            <div className="relative flex-1 md:flex-initial">
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="w-full md:w-44 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-purple-500/30 text-white text-xs font-semibold focus:outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer pr-8"
              >
                <option value="createdAt_desc">Newest First</option>
                <option value="expiry_asc">Expiring Soonest</option>
                <option value="discount_desc">Highest Discount</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Content Body */}
        {loading ? (
          <LoadingState type="table" count={5} />
        ) : error ? (
          <ErrorState title="Error Fetching Coupons" message={error} onRetry={getCoupons} />
        ) : coupons.length === 0 ? (
          <EmptyState
            icon={Tag}
            title="No coupons available"
            description="There are currently no discount coupon codes created in the database."
            actionLabel="Create Coupon"
            onAction={openCreateModal}
          />
        ) : (
          <div className="bg-[#0f172a] border border-purple-900/40 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="text-xs uppercase bg-slate-900/90 text-slate-400 border-b border-purple-900/30">
                  <tr>
                    <th className="py-4 px-6">Coupon Code</th>
                    <th className="py-4 px-6">Discount</th>
                    <th className="py-4 px-6">Requirements</th>
                    <th className="py-4 px-6">Validity Window</th>
                    <th className="py-4 px-6">Usage (Used / Limit)</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody ref={tableRef} className="divide-y divide-purple-900/20">
                  {coupons.map((coupon) => {
                    const statusInfo = getCalculatedStatus(coupon);
                    const StatusIcon = statusInfo.icon;

                    return (
                      <tr key={coupon._id} className="hover:bg-slate-900/50 transition-colors group">
                        <td className="py-4 px-6">
                          <span className="px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 font-mono font-extrabold tracking-wider text-sm">
                            {coupon.code}
                          </span>
                        </td>

                        <td className="py-4 px-6 font-bold text-emerald-400">
                          {coupon.discountType === "percentage" ? (
                            <span>{coupon.discountValue}% OFF</span>
                          ) : (
                            <span>₹{coupon.discountValue?.toLocaleString()} OFF</span>
                          )}
                        </td>

                        <td className="py-4 px-6 text-xs">
                          <p className="text-slate-200">
                            Min Order: <strong className="text-white">₹{coupon.minOrderValue?.toLocaleString()}</strong>
                          </p>
                          {coupon.discountType === "percentage" && coupon.maxDiscount > 0 && (
                            <p className="text-slate-400">
                              Max Cap: ₹{coupon.maxDiscount?.toLocaleString()}
                            </p>
                          )}
                        </td>

                        <td className="py-4 px-6 text-xs text-slate-400">
                          <p className="flex items-center gap-1 text-slate-300">
                            <Calendar className="w-3 h-3 text-purple-400" />
                            Exp: {new Date(coupon.expiryDate).toLocaleDateString()}
                          </p>
                        </td>

                        <td className="py-4 px-6 text-xs font-semibold">
                          <span className="text-white">{coupon.usedCount || 0}</span> /{" "}
                          <span className="text-slate-400">{coupon.usageLimit || "∞"}</span>
                        </td>

                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusInfo.color}`}>
                            <StatusIcon className="w-3.5 h-3.5" />
                            {statusInfo.label}
                          </span>
                        </td>

                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleToggleStatus(coupon._id)}
                              className={`p-2 rounded-xl border transition-all ${
                                coupon.isActive
                                  ? "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                  : "bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border-amber-500/30"
                              }`}
                              title={coupon.isActive ? "Disable Coupon" : "Enable Coupon"}
                            >
                              {coupon.isActive ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                            </button>

                            <button
                              onClick={() => openEditModal(coupon)}
                              className="p-2 rounded-xl bg-slate-900 hover:bg-blue-600/20 text-slate-400 hover:text-blue-400 border border-purple-500/20 transition-all"
                              title="Edit Coupon"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => confirmDelete(coupon)}
                              className="p-2 rounded-xl bg-slate-900 hover:bg-red-600/20 text-slate-400 hover:text-red-400 border border-purple-500/20 transition-all"
                              title="Delete Coupon"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="px-6 pb-4">
              <Pagination
                page={pagination.page}
                totalPages={pagination.totalPages}
                totalItems={pagination.total}
                limit={pagination.limit}
                onPageChange={(newPage) => setPage(newPage)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Create / Edit Coupon Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCoupon ? `Edit Coupon #${editingCoupon.code}` : "Create New Coupon"}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 uppercase mb-1.5">
                Coupon Code *
              </label>
              <input
                type="text"
                name="code"
                placeholder="e.g. FLIP2026"
                value={formData.code}
                onChange={handleFormChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-purple-500/30 text-white uppercase font-mono font-bold text-sm focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 uppercase mb-1.5">
                Discount Type *
              </label>
              <select
                name="discountType"
                value={formData.discountType}
                onChange={handleFormChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-purple-500/30 text-white font-semibold focus:outline-none focus:border-blue-500"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Flat Amount (₹)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 uppercase mb-1.5">
                Discount Value *
              </label>
              <input
                type="number"
                name="discountValue"
                placeholder={formData.discountType === "percentage" ? "20" : "500"}
                value={formData.discountValue}
                onChange={handleFormChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-purple-500/30 text-white font-semibold focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 uppercase mb-1.5">
                Min Order (₹)
              </label>
              <input
                type="number"
                name="minOrderValue"
                placeholder="999"
                value={formData.minOrderValue}
                onChange={handleFormChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-purple-500/30 text-white font-semibold focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 uppercase mb-1.5">
                Max Cap (₹)
              </label>
              <input
                type="number"
                name="maxDiscount"
                placeholder="1000"
                value={formData.maxDiscount}
                onChange={handleFormChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-purple-500/30 text-white font-semibold focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 uppercase mb-1.5">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleFormChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-purple-500/30 text-white font-semibold focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 uppercase mb-1.5">
                Expiry Date *
              </label>
              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleFormChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-purple-500/30 text-white font-semibold focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 items-center pt-2">
            <div>
              <label className="block font-semibold text-slate-300 uppercase mb-1.5">
                Total Usage Limit
              </label>
              <input
                type="number"
                name="usageLimit"
                placeholder="100"
                value={formData.usageLimit}
                onChange={handleFormChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-purple-500/30 text-white font-semibold focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleFormChange}
                className="w-4 h-4 rounded text-purple-600 border-purple-500/30 bg-slate-900 cursor-pointer"
              />
              <label htmlFor="isActive" className="text-white font-semibold cursor-pointer">
                Coupon Enabled & Active
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-purple-900/30">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2.5 rounded-xl bg-slate-900 border border-purple-500/30 text-slate-300 font-semibold hover:bg-slate-800 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary-gradient px-6 py-2.5 rounded-xl font-semibold text-white shadow-lg shadow-purple-600/30"
            >
              {editingCoupon ? "Save Changes" : "Create Coupon"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Delete Coupon"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-slate-300 text-sm">
            Are you sure you want to delete coupon code{" "}
            <strong className="text-white">"{couponToDelete?.code}"</strong>?
          </p>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-purple-900/30">
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-purple-500/30 text-slate-300 text-xs font-semibold hover:bg-slate-800 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition-all shadow-lg shadow-red-600/30"
            >
              Delete Coupon
            </button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
};

export default ManageCoupons;