import React, { useEffect, useState, useRef } from "react";
import { Search, Filter, ShoppingBag, Eye, Trash2, Calendar, Phone, MapPin } from "lucide-react";
import gsap from "gsap";

import AdminLayout from "./components/AdminLayout";
import Pagination from "./components/Pagination";
import LoadingState from "./components/LoadingState";
import EmptyState from "./components/EmptyState";
import ErrorState from "./components/ErrorState";
import Modal from "./components/Modal";
import NotificationToast from "./components/NotificationToast";
import api, { getImageUrl } from "../services/api";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  const [toast, setToast] = useState(null);
  const tableRef = useRef(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const getOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/api/orders/get", {
        params: {
          search: search || undefined,
          status: statusFilter !== "All" ? statusFilter : undefined,
          page,
          limit: 10,
        },
      });

      if (res.data && res.data.orders) {
        setOrders(res.data.orders);
        setPagination(
          res.data.pagination || { page: 1, limit: 10, total: res.data.orders.length, totalPages: 1 }
        );
      } else if (Array.isArray(res.data)) {
        setOrders(res.data);
        setPagination({ page: 1, limit: res.data.length, total: res.data.length, totalPages: 1 });
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err.response?.data?.message || "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, statusFilter, page]);

  useEffect(() => {
    if (!loading && orders.length > 0 && tableRef.current) {
      const rows = tableRef.current.querySelectorAll("tr");
      if (rows.length > 0) {
        gsap.fromTo(
          rows,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.3, stagger: 0.04, ease: "power2.out" }
        );
      }
    }
  }, [loading, orders]);

  const updateStatus = async (id, orderStatus) => {
    try {
      await api.put(`/api/orders/update/${id}`, { orderStatus });
      showToast(`Order status updated to ${orderStatus}`, "success");
      getOrders();
    } catch (err) {
      console.error("Update status error:", err);
      showToast(err.response?.data?.message || "Failed to update order status", "error");
    }
  };

  const confirmDelete = (order) => {
    setOrderToDelete(order);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!orderToDelete) return;

    try {
      await api.delete(`/api/orders/delete/${orderToDelete._id}`);
      showToast("Order deleted successfully", "success");
      setDeleteModalOpen(false);
      setOrderToDelete(null);
      getOrders();
    } catch (err) {
      console.error("Delete order error:", err);
      showToast(err.response?.data?.message || "Failed to delete order", "error");
    }
  };

  const openViewModal = (order) => {
    setSelectedOrder(order);
    setViewModalOpen(true);
  };

  return (
    <AdminLayout>
      <NotificationToast toast={toast} onClose={() => setToast(null)} />

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white font-['Outfit'] tracking-tight">
              Order Management
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Track customer purchases, update delivery status, and inspect order details.
            </p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-[#0f172a] border border-purple-900/40 rounded-3xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Search Customer, Phone, ID..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-purple-500/30 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>

          <div className="relative w-full sm:w-56">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-purple-500/30 text-white text-xs font-semibold focus:outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer pr-8"
            >
              <option value="All">All Order Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Content Body */}
        {loading ? (
          <LoadingState type="table" count={5} />
        ) : error ? (
          <ErrorState title="Error Fetching Orders" message={error} onRetry={getOrders} />
        ) : orders.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="No Orders Found"
            description="There are currently no customer orders matching your search parameters."
          />
        ) : (
          <div className="bg-[#0f172a] border border-purple-900/40 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="text-xs uppercase bg-slate-900/90 text-slate-400 border-b border-purple-900/30">
                  <tr>
                    <th className="py-4 px-6">Order ID</th>
                    <th className="py-4 px-6">Customer</th>
                    <th className="py-4 px-6">Date</th>
                    <th className="py-4 px-6">Total</th>
                    <th className="py-4 px-6">Order Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody ref={tableRef} className="divide-y divide-purple-900/20">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-slate-900/50 transition-colors group">
                      <td className="py-4 px-6 font-mono text-xs font-bold text-purple-400">
                        #{order._id.substring(order._id.length - 8)}
                      </td>

                      <td className="py-4 px-6">
                        <div>
                          <p className="font-semibold text-white group-hover:text-purple-300 transition-colors">
                            {order.user?.name || order.shippingAddress?.fullName || "Guest Customer"}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {order.user?.email || order.shippingAddress?.phone || "No contact info"}
                          </p>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-xs text-slate-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-4 px-6 font-bold text-emerald-400">
                        ₹{order.totalPrice?.toLocaleString()}
                      </td>

                      <td className="py-4 px-6">
                        <select
                          value={order.orderStatus || "Pending"}
                          onChange={(e) => updateStatus(order._id, e.target.value)}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 border border-purple-500/30 text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openViewModal(order)}
                            className="p-2 rounded-xl bg-slate-900 hover:bg-blue-600/20 text-slate-400 hover:text-blue-400 border border-purple-500/20 transition-all"
                            title="View Order Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => confirmDelete(order)}
                            className="p-2 rounded-xl bg-slate-900 hover:bg-red-600/20 text-slate-400 hover:text-red-400 border border-purple-500/20 transition-all"
                            title="Delete Order"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
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

      {/* View Order Details Modal */}
      <Modal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title={`Order Details #${selectedOrder?._id?.substring(selectedOrder._id.length - 8)}`}
        maxWidth="max-w-2xl"
      >
        {selectedOrder && (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-900 border border-purple-900/30 text-xs">
              <div>
                <p className="text-slate-400">Customer Name:</p>
                <p className="font-bold text-white text-sm">
                  {selectedOrder.user?.name || selectedOrder.shippingAddress?.fullName || "N/A"}
                </p>
                <p className="text-slate-400 mt-1 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-purple-400" />
                  {selectedOrder.user?.phone || selectedOrder.shippingAddress?.phone || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-purple-400" /> Date Placed:
                </p>
                <p className="font-semibold text-white">
                  {new Date(selectedOrder.createdAt).toLocaleString()}
                </p>
                <p className="text-slate-400 mt-1">Payment Method:</p>
                <p className="font-semibold text-emerald-400">{selectedOrder.paymentMethod || "COD"}</p>
              </div>
            </div>

            {/* Shipping Address */}
            {selectedOrder.shippingAddress && (
              <div className="p-4 rounded-2xl bg-slate-900 border border-purple-900/30 text-xs">
                <p className="text-slate-400 flex items-center gap-1 font-semibold text-purple-300 mb-1">
                  <MapPin className="w-3.5 h-3.5" /> Shipping Address:
                </p>
                <p className="text-slate-200">
                  {selectedOrder.shippingAddress.address},{" "}
                  {selectedOrder.shippingAddress.city},{" "}
                  {selectedOrder.shippingAddress.postalCode}
                </p>
              </div>
            )}

            {/* Ordered Items */}
            <div>
              <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3">
                Ordered Items ({selectedOrder.orderItems?.length || 0})
              </h4>
              <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                {selectedOrder.orderItems?.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-purple-900/20 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      {item.product?.images?.[0] ? (
                        <img
                          src={getImageUrl(item.product.images[0])}
                          alt={item.name || item.product?.name}
                          className="w-10 h-10 object-cover rounded-lg border border-purple-500/20"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-500">
                          <ShoppingBag className="w-5 h-5" />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-white">
                          {item.name || item.product?.name || "Product Item"}
                        </p>
                        <p className="text-slate-400">Qty: {item.qty || 1}</p>
                      </div>
                    </div>
                    <p className="font-bold text-emerald-400">
                      ₹{((item.price || item.product?.price || 0) * (item.qty || 1)).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Price summary */}
            <div className="flex justify-between items-center pt-4 border-t border-purple-900/30">
              <span className="text-sm font-bold text-white">Total Amount:</span>
              <span className="text-xl font-extrabold text-emerald-400 font-['Outfit']">
                ₹{selectedOrder.totalPrice?.toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Delete Order"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-slate-300 text-sm">
            Are you sure you want to delete order{" "}
            <strong className="text-white">
              #{orderToDelete?._id?.substring(orderToDelete._id.length - 8)}
            </strong>
            ?
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
              Delete Order
            </button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
};

export default ManageOrders;