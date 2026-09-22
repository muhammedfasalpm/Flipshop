import React, { useEffect, useState, useRef } from "react";
import { Search, Users, ShieldAlert, ShieldCheck, Trash2, Lock, Unlock, Mail, Phone } from "lucide-react";
import gsap from "gsap";

import AdminLayout from "./components/AdminLayout";
import Pagination from "./components/Pagination";
import LoadingState from "./components/LoadingState";
import EmptyState from "./components/EmptyState";
import ErrorState from "./components/ErrorState";
import Modal from "./components/Modal";
import NotificationToast from "./components/NotificationToast";
import api from "../services/api";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [toast, setToast] = useState(null);

  const tableRef = useRef(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const getUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/api/users", {
        params: {
          search: search || undefined,
          page,
          limit: 10,
        },
      });

      if (res.data && res.data.users) {
        setUsers(res.data.users);
        setPagination(
          res.data.pagination || { page: 1, limit: 10, total: res.data.users.length, totalPages: 1 }
        );
      } else if (Array.isArray(res.data)) {
        setUsers(res.data);
        setPagination({ page: 1, limit: res.data.length, total: res.data.length, totalPages: 1 });
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.response?.data?.message || "Failed to load users list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, page]);

  useEffect(() => {
    if (!loading && users.length > 0 && tableRef.current) {
      const rows = tableRef.current.querySelectorAll("tr");
      if (rows.length > 0) {
        gsap.fromTo(
          rows,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.3, stagger: 0.04, ease: "power2.out" }
        );
      }
    }
  }, [loading, users]);

  const confirmDelete = (user) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!userToDelete) return;
    try {
      await api.delete(`/api/users/delete/${userToDelete._id}`);
      showToast("User account deleted successfully", "success");
      setDeleteModalOpen(false);
      setUserToDelete(null);
      getUsers();
    } catch (err) {
      console.error("Delete user error:", err);
      showToast(err.response?.data?.message || "Failed to delete user", "error");
    }
  };

  const handleBlock = async (id) => {
    try {
      const res = await api.put(`/api/users/block/${id}`);
      showToast(res.data?.message || "User account status updated", "success");
      getUsers();
    } catch (err) {
      console.error("Block user error:", err);
      showToast(err.response?.data?.message || "Failed to update user block status", "error");
    }
  };

  return (
    <AdminLayout>
      <NotificationToast toast={toast} onClose={() => setToast(null)} />

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white font-['Outfit'] tracking-tight">
              User Accounts
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Registered customers and administrator profiles stored in MongoDB Atlas.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-[#0f172a] border border-purple-900/40 rounded-3xl p-4 flex items-center justify-between shadow-xl">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search by Name, Email, Phone..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-purple-500/30 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>

          <span className="text-xs font-semibold text-slate-400 hidden sm:inline">
            Total Users: <strong className="text-purple-400">{pagination.total}</strong>
          </span>
        </div>

        {/* Content Body */}
        {loading ? (
          <LoadingState type="table" count={5} />
        ) : error ? (
          <ErrorState title="Error Fetching Users" message={error} onRetry={getUsers} />
        ) : users.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No Users Found"
            description="There are currently no user accounts matching your query."
          />
        ) : (
          <div className="bg-[#0f172a] border border-purple-900/40 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="text-xs uppercase bg-slate-900/90 text-slate-400 border-b border-purple-900/30">
                  <tr>
                    <th className="py-4 px-6">User Profile</th>
                    <th className="py-4 px-6">Contact Details</th>
                    <th className="py-4 px-6">Role</th>
                    <th className="py-4 px-6">Account Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody ref={tableRef} className="divide-y divide-purple-900/20">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-slate-900/50 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow">
                            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                          </div>
                          <div>
                            <p className="font-semibold text-white group-hover:text-purple-300 transition-colors">
                              {user.name}
                            </p>
                            <p className="text-[11px] text-slate-400 font-mono">
                              ID: {user._id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-xs">
                        <p className="text-slate-200 flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-purple-400" />
                          {user.email}
                        </p>
                        <p className="text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <Phone className="w-3.5 h-3.5 text-slate-500" />
                          {user.phone || "—"}
                        </p>
                      </td>

                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${
                            user.role === "admin"
                              ? "bg-purple-500/10 text-purple-300 border-purple-500/30"
                              : "bg-blue-500/10 text-blue-300 border-blue-500/30"
                          }`}
                        >
                          {user.role === "admin" ? <ShieldCheck className="w-3.5 h-3.5 text-purple-400" /> : null}
                          {user.role}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                            user.isBlocked
                              ? "bg-red-500/10 text-red-400 border-red-500/30"
                              : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                          }`}
                        >
                          {user.isBlocked ? "Blocked" : "Active"}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right">
                        {user.role !== "admin" ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleBlock(user._id)}
                              className={`p-2 rounded-xl border transition-all ${
                                user.isBlocked
                                  ? "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                  : "bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border-amber-500/30"
                              }`}
                              title={user.isBlocked ? "Unblock User" : "Block User"}
                            >
                              {user.isBlocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                            </button>

                            <button
                              onClick={() => confirmDelete(user)}
                              className="p-2 rounded-xl bg-slate-900 hover:bg-red-600/20 text-slate-400 hover:text-red-400 border border-purple-500/20 transition-all"
                              title="Delete User Account"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-500 italic">Protected Admin</span>
                        )}
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Delete User Account"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-slate-300 text-sm">
            Are you sure you want to permanently delete user{" "}
            <strong className="text-white">"{userToDelete?.name}"</strong> ({userToDelete?.email})?
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
              Delete User
            </button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
};

export default ManageUsers;