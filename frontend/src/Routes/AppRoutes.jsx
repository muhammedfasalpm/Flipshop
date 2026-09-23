import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

// Layout
import UserLayout from "../admin/components/UserLayout";

// Home page loaded directly for fastest initial landing response
import Home from "../pages/Home";

// Lazy-loaded User Pages
const Products = lazy(() => import("../pages/Product"));
const ProductDetails = lazy(() => import("../pages/ProductDetails"));
const Cart = lazy(() => import("../pages/Cart"));
const Checkout = lazy(() => import("../pages/Checkout"));
const Wishlist = lazy(() => import("../pages/Wishlist"));
const Orders = lazy(() => import("../pages/Orders"));
const Profile = lazy(() => import("../pages/Profile"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));

// Lazy-loaded Admin Pages
const AdminDashboard = lazy(() => import("../admin/AdminDashboard"));
const ManageProducts = lazy(() => import("../admin/ManageProducts"));
const AddProduct = lazy(() => import("../admin/AddProduct"));
const EditProduct = lazy(() => import("../admin/EditProduct"));
const ManageUsers = lazy(() => import("../admin/ManageUser"));
const ManageOrders = lazy(() => import("../admin/ManageOrders"));
const ManageCategories = lazy(() => import("../admin/ManageCategories"));
const ManageCoupons = lazy(() => import("../admin/ManageCoupons"));

// Protected Route Guard
import AdminProtectedRoute from "../admin/components/AdminProtectRoute";

// Reusable Lightweight Suspense Loading Indicator
const PageFallback = () => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3 text-slate-400">
    <div className="w-9 h-9 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
    <span className="text-xs font-semibold tracking-wider text-slate-400 animate-pulse">Loading...</span>
  </div>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        {/* **************** User Routes **************** */}
        <Route element={<UserLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* **************** Admin Routes **************** */}
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/products"
          element={
            <AdminProtectedRoute>
              <ManageProducts />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/add-product"
          element={
            <AdminProtectedRoute>
              <AddProduct />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/edit-product/:id"
          element={
            <AdminProtectedRoute>
              <EditProduct />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <AdminProtectedRoute>
              <ManageOrders />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <AdminProtectedRoute>
              <ManageUsers />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/categories"
          element={
            <AdminProtectedRoute>
              <ManageCategories />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/coupons"
          element={
            <AdminProtectedRoute>
              <ManageCoupons />
            </AdminProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
