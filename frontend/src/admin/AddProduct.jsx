import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Upload, Plus, Package, Tag, Layers, DollarSign, Archive, Image as ImageIcon } from "lucide-react";

import AdminLayout from "./components/AdminLayout";
import NotificationToast from "./components/NotificationToast";
import api from "../services/api";

const AddProduct = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    brand: "",
    price: "",
    stock: "",
  });

  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    let ignore = false;
    const fetchCategories = async () => {
      try {
        const res = await api.get("/api/categories/get");
        if (!ignore && Array.isArray(res.data)) {
          setCategories(res.data);
        } else if (!ignore && res.data && Array.isArray(res.data.categories)) {
          setCategories(res.data.categories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
    return () => {
      ignore = true;
    };
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.description ||
      !formData.category ||
      !formData.brand ||
      !formData.price ||
      !formData.stock
    ) {
      showToast("Please fill all required fields", "error");
      return;
    }

    if (images.length === 0) {
      showToast("Please upload at least one product image", "error");
      return;
    }

    setSubmitting(true);
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("category", formData.category);
      data.append("brand", formData.brand);
      data.append("price", formData.price);
      data.append("stock", formData.stock);

      images.forEach((image) => {
        data.append("images", image);
      });

      const res = await api.post("/api/products/add", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      showToast(res.data.message || "Product created successfully", "success");

      setTimeout(() => {
        navigate("/admin/products");
      }, 1000);
    } catch (error) {
      console.error("Add product error:", error);
      showToast(error.response?.data?.message || "Failed to add product", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <NotificationToast toast={toast} onClose={() => setToast(null)} />

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Products List
          </Link>
        </div>

        {/* Form Container */}
        <div className="bg-[#0f172a] border border-purple-900/40 rounded-3xl p-6 sm:p-10 shadow-2xl">
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-purple-900/30">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Plus className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white font-['Outfit']">Add New Product</h1>
              <p className="text-slate-400 text-xs mt-0.5">
                Create a new product item in your store inventory database.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Product Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-purple-400" /> Product Title
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Sony WH-1000XM5 Wireless Headphones"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-purple-500/30 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition-all"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-purple-400" /> Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-purple-500/30 text-white text-sm focus:outline-none focus:border-blue-500 transition-all"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c._id || c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Detailed Product Description
              </label>
              <textarea
                name="description"
                placeholder="Describe key features, specifications, and details..."
                rows="4"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-purple-500/30 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition-all"
                required
              />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Brand */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-purple-400" /> Brand
                </label>
                <input
                  type="text"
                  name="brand"
                  placeholder="e.g. Sony, Apple, Nike"
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-purple-500/30 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition-all"
                  required
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Price (₹)
                </label>
                <input
                  type="number"
                  name="price"
                  placeholder="2999"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-purple-500/30 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition-all"
                  required
                />
              </div>

              {/* Stock */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Archive className="w-3.5 h-3.5 text-amber-400" /> Stock Quantity
                </label>
                <input
                  type="number"
                  name="stock"
                  placeholder="50"
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-purple-500/30 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition-all"
                  required
                />
              </div>
            </div>

            {/* Product Image File Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-purple-400" /> Upload Product Images
              </label>
              <div className="relative border-2 border-dashed border-purple-500/30 hover:border-purple-500/60 rounded-2xl p-6 bg-slate-900/50 text-center transition-all cursor-pointer">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center gap-2">
                  <Upload className="w-8 h-8 text-purple-400" />
                  <p className="text-sm font-semibold text-white">Click or drag images to upload</p>
                  <p className="text-xs text-slate-500">Supports PNG, JPG, WEBP formats</p>
                </div>
              </div>
            </div>

            {/* Image Preview Grid */}
            {previewImages.length > 0 && (
              <div>
                <span className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Selected Image Previews
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {previewImages.map((src, idx) => (
                    <div key={idx} className="relative rounded-2xl overflow-hidden border border-purple-500/30 h-28">
                      <img src={src} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Action */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full btn-primary-gradient py-3.5 rounded-xl font-semibold text-white text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 hover:shadow-blue-500/40 transition-all disabled:opacity-50 mt-4"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Create Product</span>
                  <Plus className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AddProduct;