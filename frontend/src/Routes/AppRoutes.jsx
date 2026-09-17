import { Routes, Route } from "react-router-dom";

// Layout
import UserLayout from "../admin/components/UserLayout";


// User Pages
import Home from "../pages/Home";
import Products from "../pages/Product";
import ProductDetails from "../pages/ProductDetails";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Wishlist from "../pages/Wishlist";
import Orders from "../pages/Orders";
import Profile from "../pages/Profile";
import Login from "../pages/Login";
import Register from "../pages/Register";

// Admin Pages
import AdminDashboard from "../admin/AdminDashboard";
import ManageProducts from "../admin/ManageProducts";
import AddProduct from "../admin/AddProduct";
import EditProduct from "../admin/EditProduct";
import ManageUsers from "../admin/ManageUser";
import ManageOrders from "../admin/ManageOrders";
import ManageCategories from "../admin/ManageCategories";
import ManageCoupons from "../admin/ManageCoupons";

// Protected Route
import AdminProtectedRoute from "../admin/components/AdminProtectRoute";

const AppRoutes = () => {
  return (
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
  );
};

export default AppRoutes;
