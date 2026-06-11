import React from "react";

const AdminNavbar = () => {
  return (
    <div className="bg-white shadow px-6 py-4 flex justify-between">

      <h1 className="text-2xl font-bold">
        FlipShop Admin
      </h1>

      <button className="bg-red-600 text-white px-4 py-2 rounded">
        Logout
      </button>

    </div>
  );
};

export default AdminNavbar;