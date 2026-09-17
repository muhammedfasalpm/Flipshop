import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "./components/AdminLayout";
import { API_URL } from "../services/api";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const getUsers = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/users`
      );

      setUsers(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    let ignore = false;
    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/users`
        );
        if (!ignore) {
          setUsers(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsers();
    return () => {
      ignore = true;
    };
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${API_URL}/api/users/delete/${id}`
      );

      alert("User Deleted Successfully");

      getUsers();
    } catch (error) {
      console.log(error);
    }
  };

  const handleBlock = async (id) => {
    try {
      await axios.put(
        `${API_URL}/api/users/block/${id}`
      );

      getUsers();
    } catch (error) {
      console.log(error);
    }
  };


  const filteredUsers = users.filter(
    (user) =>
      user.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      user.email
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="bg-white p-6 rounded-lg shadow">

        <div className="flex justify-between items-center mb-8">

          <h1 className="text-3xl font-bold">
            Manage Users
          </h1>

          <input
            type="text"
            placeholder="Search User..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="border p-3 rounded w-72"
          />

        </div>

        <div className="overflow-x-auto">

          <table className="w-full border">

            <thead className="bg-gray-200">

              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>

            </thead>

            <tbody>

              {filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  className="border-b text-center"
                >

                  <td className="p-4">
                    {user.name}
                  </td>

                  <td className="p-4">
                    {user.email}
                  </td>

                  <td className="p-4">
                    {user.phone}
                  </td>

                  <td className="p-4">
                    <span
                      className={`font-semibold ${
                        user.role === "admin"
                          ? "text-purple-600"
                          : "text-blue-600"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td className="p-4">

                    {user.isBlocked ? (
                      <span className="text-red-600 font-bold">
                        Blocked
                      </span>
                    ) : (
                      <span className="text-green-600 font-bold">
                        Active
                      </span>
                    )}

                  </td>

                  <td className="p-4 space-x-2">

                    {user.role !== "admin" && (
                      <>
                        <button
                          onClick={() =>
                            handleBlock(user._id)
                          }
                          className="bg-yellow-500 text-white px-4 py-2 rounded"
                        >
                          {user.isBlocked
                            ? "Unblock"
                            : "Block"}
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(user._id)
                          }
                          className="bg-red-600 text-white px-4 py-2 rounded"
                        >
                          Delete
                        </button>
                      </>
                    )}

                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>
    </AdminLayout>
  );
};

export default ManageUsers;