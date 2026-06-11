import React, { useState } from "react";

const ManageUsers = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Fasal PK",
      email: "fasal@gmail.com",
      role: "Admin",
      status: "Active",
    },
    {
      id: 2,
      name: "Rahul",
      email: "rahul@gmail.com",
      role: "User",
      status: "Active",
    },
    {
      id: 3,
      name: "Arjun",
      email: "arjun@gmail.com",
      role: "User",
      status: "Blocked",
    },
  ]);

  const toggleStatus = (id) => {
    setUsers(
      users.map((user) =>
        user.id === id
          ? {
              ...user,
              status:
                user.status === "Active"
                  ? "Blocked"
                  : "Active",
            }
          : user
      )
    );
  };

  const deleteUser = (id) => {
    setUsers(
      users.filter((user) => user.id !== id)
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <h1 className="text-3xl font-bold mb-8">
        Manage Users
      </h1>

      <div className="bg-white rounded-lg shadow overflow-x-auto">

        <table className="w-full">

          <thead className="bg-gray-200">

            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>

          </thead>

          <tbody>

            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b text-center"
              >
                <td className="p-4">
                  {user.name}
                </td>

                <td className="p-4">
                  {user.email}
                </td>

                <td className="p-4">
                  {user.role}
                </td>

                <td
                  className={`p-4 font-semibold ${
                    user.status === "Active"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {user.status}
                </td>

                <td className="p-4 space-x-2">

                  <button
                    onClick={() =>
                      toggleStatus(user.id)
                    }
                    className={`px-4 py-2 rounded text-white ${
                      user.status === "Active"
                        ? "bg-yellow-500"
                        : "bg-green-600"
                    }`}
                  >
                    {user.status === "Active"
                      ? "Block"
                      : "Unblock"}
                  </button>

                  <button
                    onClick={() =>
                      deleteUser(user.id)
                    }
                    className="bg-red-600 text-white px-4 py-2 rounded"
                  >
                    Delete
                  </button>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default ManageUsers;