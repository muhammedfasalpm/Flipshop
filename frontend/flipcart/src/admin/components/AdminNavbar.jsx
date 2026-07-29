import React from "react";
import { useNavigate } from "react-router-dom";

const AdminNavbar = () => {

  const navigate = useNavigate();

  const userInfo = JSON.parse(
    localStorage.getItem("userInfo")
  );

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  return (
    <div className="bg-white shadow p-4 flex justify-between items-center">

      <button
        onClick={() => navigate(-1)}
        className="bg-gray-200 px-4 py-2 rounded"
      >
        ← Back
      </button>

      <div className="flex items-center gap-5">

        <h2 className="font-semibold">
          {userInfo?.name}
        </h2>

        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>

      </div>

    </div>
  );
};

export default AdminNavbar;