import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white shadow">

      <div className="max-w-7xl mx-auto px-5">

        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold"
          >
            FlipShop
          </Link>

          {/* Search */}
          <div className="hidden md:block w-1/3">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full px-4 py-2 rounded text-white bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          {/* Links */}
          <div className="flex items-center gap-5">

            <Link to="/">Home</Link>

            <Link to="/products">
              Products
            </Link>

            <Link to="/wishlist">
              Wishlist
            </Link>

            <Link to="/cart">
              Cart
            </Link>

            <Link to="/orders">
              Orders
            </Link>

            <Link to="/profile">
              Profile
            </Link>

            <Link
              to="/login"
              className="bg-white text-blue-600 px-4 py-2 rounded"
            >
              Login
            </Link>

          </div>

        </div>

      </div>

    </nav>
  );
};

export default Navbar;