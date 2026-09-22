import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, Edit2, Trash2, Package, Filter, ArrowUpDown } from "lucide-react";
import gsap from "gsap";

import AdminLayout from "./components/AdminLayout";
import Pagination from "./components/Pagination";
import LoadingState from "./components/LoadingState";
import EmptyState from "./components/EmptyState";
import ErrorState from "./components/ErrorState";
import Modal from "./components/Modal";
import NotificationToast from "./components/NotificationToast";
import api, { getImageUrl } from "../services/api";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sort, setSort] = useState("createdAt_desc");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Toast notification state
  const [toast, setToast] = useState(null);

  const tableRef = useRef(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/api/categories/get");
      if (res.data && Array.isArray(res.data)) {
        setCategories(res.data);
      } else if (res.data && Array.isArray(res.data.categories)) {
        setCategories(res.data.categories);
      }
    } catch (e) {
      console.error("Error fetching categories for filter:", e);
    }
  };

  const getProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/api/products/get", {
        params: {
          search: search || undefined,
          category: selectedCategory || undefined,
          sort: sort || undefined,
          page,
          limit: 10,
        },
      });

      if (res.data && res.data.products) {
        setProducts(res.data.products);
        setPagination(
          res.data.pagination || { page: 1, limit: 10, total: res.data.products.length, totalPages: 1 }
        );
      } else if (Array.isArray(res.data)) {
        setProducts(res.data);
        setPagination({ page: 1, limit: res.data.length, total: res.data.length, totalPages: 1 });
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.response?.data?.message || "Failed to load products from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    getProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, selectedCategory, sort, page]);

  useEffect(() => {
    if (!loading && products.length > 0 && tableRef.current) {
      const rows = tableRef.current.querySelectorAll("tr");
      if (rows.length > 0) {
        gsap.fromTo(
          rows,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.3, stagger: 0.04, ease: "power2.out" }
        );
      }
    }
  }, [loading, products]);

  const confirmDelete = (product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    try {
      await api.delete(`/api/products/delete/${productToDelete._id}`);
      showToast("Product deleted successfully", "success");
      setDeleteModalOpen(false);
      setProductToDelete(null);
      getProducts();
    } catch (err) {
      console.error("Delete error:", err);
      showToast(err.response?.data?.message || "Failed to delete product", "error");
    }
  };

  return (
    <AdminLayout>
      <NotificationToast toast={toast} onClose={() => setToast(null)} />

      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white font-['Outfit'] tracking-tight">
              Product Inventory
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Manage, search, filter, and modify catalog items stored in MongoDB Atlas.
            </p>
          </div>

          <Link
            to="/admin/add-product"
            className="btn-primary-gradient px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg shadow-purple-600/30 hover:scale-105 transition-transform self-start sm:self-auto"
          >
            <Plus className="w-4.5 h-4.5" />
            <span>Add Product</span>
          </Link>
        </div>

        {/* Filter & Search Bar Controls */}
        <div className="bg-[#0f172a] border border-purple-900/40 rounded-3xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search product title..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-purple-500/30 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Category Filter */}
            <div className="relative flex-1 md:flex-initial">
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setPage(1);
                }}
                className="w-full md:w-48 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-purple-500/30 text-white text-xs font-semibold focus:outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer pr-8"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c._id || c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
              <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Sort Selector */}
            <div className="relative flex-1 md:flex-initial">
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="w-full md:w-48 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-purple-500/30 text-white text-xs font-semibold focus:outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer pr-8"
              >
                <option value="createdAt_desc">Newest First</option>
                <option value="createdAt_asc">Oldest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Content Body */}
        {loading ? (
          <LoadingState type="table" count={5} />
        ) : error ? (
          <ErrorState title="Error Fetching Products" message={error} onRetry={getProducts} />
        ) : products.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No Products Found"
            description="There are currently no products matching your search criteria in the database."
            actionLabel="Add First Product"
            onAction={() => (window.location.href = "/admin/add-product")}
          />
        ) : (
          <div className="bg-[#0f172a] border border-purple-900/40 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="text-xs uppercase bg-slate-900/90 text-slate-400 border-b border-purple-900/30">
                  <tr>
                    <th className="py-4 px-6">Product</th>
                    <th className="py-4 px-6">Category</th>
                    <th className="py-4 px-6">Price</th>
                    <th className="py-4 px-6">Stock Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody ref={tableRef} className="divide-y divide-purple-900/20">
                  {products.map((product) => (
                    <tr key={product._id} className="hover:bg-slate-900/50 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3.5">
                          <img
                            src={getImageUrl(product.images?.[0])}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-xl border border-purple-500/20 bg-slate-900 shrink-0"
                          />
                          <div>
                            <p className="font-semibold text-white group-hover:text-purple-300 transition-colors">
                              {product.name}
                            </p>
                            <p className="text-[11px] text-slate-400 font-mono truncate max-w-[180px]">
                              ID: {product._id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/30">
                          {product.category || "Uncategorized"}
                        </span>
                      </td>

                      <td className="py-4 px-6 font-bold text-emerald-400">
                        ₹{product.price?.toLocaleString()}
                      </td>

                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                            product.stock > 5
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                              : product.stock > 0
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                              : "bg-red-500/10 text-red-400 border-red-500/30"
                          }`}
                        >
                          {product.stock > 0 ? `${product.stock} in stock` : "Out of Stock"}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/edit-product/${product._id}`}
                            className="p-2 rounded-xl bg-slate-900 hover:bg-blue-600/20 text-slate-400 hover:text-blue-400 border border-purple-500/20 transition-all"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>

                          <button
                            onClick={() => confirmDelete(product)}
                            className="p-2 rounded-xl bg-slate-900 hover:bg-red-600/20 text-slate-400 hover:text-red-400 border border-purple-500/20 transition-all"
                            title="Delete Product"
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

            {/* Pagination Controls */}
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
        title="Confirm Delete Product"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-slate-300 text-sm">
            Are you sure you want to permanently delete{" "}
            <strong className="text-white">"{productToDelete?.name}"</strong>? This action cannot be undone.
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
              Confirm Delete
            </button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
};

export default ManageProducts;
