import React, { useState } from "react";
import { useParams } from "react-router-dom";

const EditProduct = () => {
  const { id } = useParams();

  // Temporary dummy data
  const [formData, setFormData] = useState({
    name: "iPhone 15 Pro Max",
    description:
      "The iPhone 15 Pro Max features A17 Pro chip and advanced camera system.",
    category: "Mobiles",
    brand: "Apple",
    price: 129999,
    stock: 15,
    image:
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Updated Product:", id, formData);

    // Backend connect cheyyumbo:
    // axios.put(`/api/products/${id}`, formData)

    alert("Product Updated Successfully");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-8">

        <h1 className="text-3xl font-bold mb-8">
          Edit Product
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* Name */}
          <div>
            <label className="font-semibold">
              Product Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border p-3 rounded mt-2"
            />
          </div>

          {/* Description */}
          <div>
            <label className="font-semibold">
              Description
            </label>

            <textarea
              rows="4"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border p-3 rounded mt-2"
            />
          </div>

          {/* Category */}
          <div>
            <label className="font-semibold">
              Category
            </label>

            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border p-3 rounded mt-2"
            />
          </div>

          {/* Brand */}
          <div>
            <label className="font-semibold">
              Brand
            </label>

            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="w-full border p-3 rounded mt-2"
            />
          </div>

          {/* Price */}
          <div>
            <label className="font-semibold">
              Price
            </label>

            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full border p-3 rounded mt-2"
            />
          </div>

          {/* Stock */}
          <div>
            <label className="font-semibold">
              Stock
            </label>

            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="w-full border p-3 rounded mt-2"
            />
          </div>

          {/* Image */}
          <div>
            <label className="font-semibold">
              Image URL
            </label>

            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full border p-3 rounded mt-2"
            />
          </div>

          {/* Preview */}
          <div>
            <img
              src={formData.image}
              alt={formData.name}
              className="w-48 h-48 object-cover rounded border"
            />
          </div>

          {/* Update Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
          >
            Save Changes
          </button>

        </form>

      </div>

    </div>
  );
};

export default EditProduct;