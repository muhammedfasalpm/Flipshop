import React, { useEffect, useState, useRef } from "react";
import { Plus, Edit2, Trash2, FolderKanban, Search } from "lucide-react";
import gsap from "gsap";

import AdminLayout from "./components/AdminLayout";
import LoadingState from "./components/LoadingState";
import EmptyState from "./components/EmptyState";
import ErrorState from "./components/ErrorState";
import Modal from "./components/Modal";
import NotificationToast from "./components/NotificationToast";
import api from "../services/api";

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [toast, setToast] = useState(null);

  const tableRef = useRef(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const getCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/api/categories/get");
      if (res.data && Array.isArray(res.data)) {
        setCategories(res.data);
      } else if (res.data && Array.isArray(res.data.categories)) {
        setCategories(res.data.categories);
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError(err.response?.data?.message || "Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    if (!loading && categories.length > 0 && tableRef.current) {
      const rows = tableRef.current.querySelectorAll("tr");
      if (rows.length > 0) {
        gsap.fromTo(
          rows,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.3, stagger: 0.04, ease: "power2.out" }
        );
      }
    }
  }, [loading, categories]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast("Please enter a category name", "error");
      return;
    }

    try {
      if (editId) {
        await api.put(`/api/categories/update/${editId}`, { name: name.trim() });
        showToast("Category updated successfully", "success");
        setEditId(null);
      } else {
        await api.post("/api/categories/add", { name: name.trim() });
        showToast("Category added successfully", "success");
      }

      setName("");
      getCategories();
    } catch (err) {
      console.error("Category save error:", err);
      showToast(err.response?.data?.message || "Failed to save category", "error");
    }
  };

  const confirmDelete = (cat) => {
    setCategoryToDelete(cat);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;

    try {
      await api.delete(`/api/categories/delete/${categoryToDelete._id}`);
      showToast("Category deleted successfully", "success");
      setDeleteModalOpen(false);
      setCategoryToDelete(null);
      getCategories();
    } catch (err) {
      console.error("Delete category error:", err);
      showToast(err.response?.data?.message || "Failed to delete category", "error");
    }
  };

  const filteredCategories = categories.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <NotificationToast toast={toast} onClose={() => setToast(null)} />

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white font-['Outfit'] tracking-tight">
              Manage Categories
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Add, edit, or remove catalog product categories in MongoDB Atlas.
            </p>
          </div>
        </div>

        {/* Add/Edit Form Card */}
        <div className="bg-[#0f172a] border border-purple-900/40 rounded-3xl p-6 shadow-xl">
          <h3 className="text-base font-bold text-white font-['Outfit'] mb-4">
            {editId ? "Edit Category Name" : "Create New Category"}
          </h3>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="e.g. Smart Electronics, Fashion, Footwear..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-purple-500/30 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition-all"
              required
            />

            <button
              type="submit"
              className="btn-primary-gradient px-6 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 hover:scale-105 transition-transform shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>{editId ? "Update Category" : "Add Category"}</span>
            </button>

            {editId && (
              <button
                type="button"
                onClick={() => {
                  setEditId(null);
                  setName("");
                }}
                className="px-5 py-3 rounded-xl bg-slate-900 border border-purple-500/30 text-slate-300 text-sm font-semibold hover:bg-slate-800 transition-all"
              >
                Cancel
              </button>
            )}
          </form>
        </div>

        {/* Search Bar & Category List Table */}
        <div className="bg-[#0f172a] border border-purple-900/40 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-purple-900/30 flex items-center justify-between gap-4">
            <div className="relative w-full max-w-sm">
              <input
                type="text"
                placeholder="Filter categories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-purple-500/20 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500 transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>

            <span className="text-xs font-semibold text-slate-400">
              Total Categories: <strong className="text-purple-400">{categories.length}</strong>
            </span>
          </div>

          {loading ? (
            <LoadingState type="table" count={4} />
          ) : error ? (
            <ErrorState title="Error Fetching Categories" message={error} onRetry={getCategories} />
          ) : filteredCategories.length === 0 ? (
            <EmptyState
              icon={FolderKanban}
              title="No Categories Available"
              description="Create your first category above to begin organizing your products."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="text-xs uppercase bg-slate-900/90 text-slate-400 border-b border-purple-900/30">
                  <tr>
                    <th className="py-4 px-6">Category Name</th>
                    <th className="py-4 px-6">Category ID</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody ref={tableRef} className="divide-y divide-purple-900/20">
                  {filteredCategories.map((cat) => (
                    <tr key={cat._id} className="hover:bg-slate-900/50 transition-colors group">
                      <td className="py-4 px-6 font-semibold text-white group-hover:text-purple-300 transition-colors">
                        {cat.name}
                      </td>

                      <td className="py-4 px-6 font-mono text-xs text-slate-400">
                        {cat._id}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setName(cat.name);
                              setEditId(cat._id);
                            }}
                            className="p-2 rounded-xl bg-slate-900 hover:bg-blue-600/20 text-slate-400 hover:text-blue-400 border border-purple-500/20 transition-all"
                            title="Edit Category"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => confirmDelete(cat)}
                            className="p-2 rounded-xl bg-slate-900 hover:bg-red-600/20 text-slate-400 hover:text-red-400 border border-purple-500/20 transition-all"
                            title="Delete Category"
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
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Delete Category"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-slate-300 text-sm">
            Are you sure you want to delete category{" "}
            <strong className="text-white">"{categoryToDelete?.name}"</strong>?
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
              Delete Category
            </button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
};

export default ManageCategories;
