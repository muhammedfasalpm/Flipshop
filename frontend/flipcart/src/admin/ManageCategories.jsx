
import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "./components/AdminLayout";

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    try {
      const res = await axios.get(
        "http://localhost:4000/api/categories/get"
      );

      setCategories(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const addCategory = async (e) => {
    e.preventDefault();

    if (!name) {
      return alert("Enter category name");
    }

    try {
      if (editId) {
        await axios.put(
          `http://localhost:4000/api/categories/update/${editId}`,
          {
            name,
          }
        );

        alert("Category updated");
        setEditId(null);
      } else {
        await axios.post(
          "http://localhost:4000/api/categories/add",
          {
            name,
          }
        );

        alert("Category added");
      }

      setName("");
      getCategories();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:4000/api/categories/delete/${id}`
      );

      getCategories();

      alert("Category deleted");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-100 p-6">

        <div className="bg-white rounded shadow p-6">

          <h1 className="text-3xl font-bold mb-8">
            Manage Categories
          </h1>

          {/* Add / Update Category */}
          <form
            onSubmit={addCategory}
            className="flex gap-4 mb-8"
          >
            <input
              type="text"
              placeholder="Category Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 border p-3 rounded"
            />

            <button
              className="bg-green-600 text-white px-6 rounded"
            >
              {editId ? "Update" : "Add"}
            </button>
          </form>

          {/* Category Table */}
          <table className="w-full">

            <thead className="bg-gray-200">
              <tr>
                <th className="p-4">
                  Category Name
                </th>

                <th className="p-4">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>

              {categories.map((category) => (
                <tr
                  key={category._id}
                  className="border-b text-center"
                >

                  <td className="p-4">
                    {category.name}
                  </td>

                  <td className="space-x-2">

                    <button
                      onClick={() => {
                        setName(category.name);
                        setEditId(category._id);
                      }}
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        deleteCategory(category._id)
                      }
                      className="bg-red-500 text-white px-4 py-2 rounded"
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
    </AdminLayout>
  );
};

export default ManageCategories;

