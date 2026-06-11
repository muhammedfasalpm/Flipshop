import React, { useState } from "react";

const ManageCategories = () => {
  const [category, setCategory] = useState("");

  const [categories, setCategories] = useState([
    "Mobiles",
    "Electronics",
    "Fashion",
    "Home",
    "Beauty",
  ]);

  const addCategory = (e) => {
    e.preventDefault();

    if (!category.trim()) return;

    setCategories([...categories, category]);
    setCategory("");
  };

  const deleteCategory = (index) => {
    setCategories(
      categories.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <h1 className="text-3xl font-bold mb-8">
        Manage Categories
      </h1>

      {/* Add Category */}
      <div className="bg-white p-6 rounded shadow mb-8">

        <form
          onSubmit={addCategory}
          className="flex gap-4"
        >
          <input
            type="text"
            placeholder="Enter Category Name"
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
            className="flex-1 border p-3 rounded"
          />

          <button
            type="submit"
            className="bg-green-600 text-white px-6 rounded"
          >
            Add Category
          </button>
        </form>

      </div>

      {/* Category List */}
      <div className="bg-white rounded shadow p-6">

        <h2 className="text-2xl font-semibold mb-5">
          Category List
        </h2>

        <div className="space-y-4">

          {categories.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center border-b pb-3"
            >
              <h3 className="font-medium">
                {item}
              </h3>

              <button
                onClick={() =>
                  deleteCategory(index)
                }
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          ))}

        </div>

      </div>

    </div>
  );
};

export default ManageCategories;