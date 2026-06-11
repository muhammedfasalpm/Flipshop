import React from "react";
import { Link } from "react-router-dom";

const ManageProducts = () => {
  const products = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300",
      name: "iPhone 15 Pro Max",
      price: 129999,
      stock: 15,
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300",
      name: "Nike Air Max",
      price: 4999,
      stock: 30,
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300",
      name: "HP Laptop",
      price: 54999,
      stock: 8,
    },
  ];

  const handleDelete = (id) => {
    alert(`Delete Product ${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-3xl font-bold">
          Manage Products
        </h1>

        <Link
          to="/admin/add-product"
          className="bg-green-600 text-white px-5 py-3 rounded"
        >
          + Add Product
        </Link>

      </div>

      <div className="bg-white rounded shadow overflow-x-auto">

        <table className="w-full">

          <thead className="bg-gray-200">

            <tr>
              <th className="p-4">Image</th>
              <th className="p-4">Name</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Actions</th>
            </tr>

          </thead>

          <tbody>

            {products.map((product) => (
              <tr
                key={product.id}
                className="border-b text-center"
              >
                <td className="p-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-20 object-cover mx-auto rounded"
                  />
                </td>

                <td className="p-4">
                  {product.name}
                </td>

                <td className="p-4 text-green-600 font-bold">
                  ₹{product.price}
                </td>

                <td className="p-4">
                  {product.stock}
                </td>

                <td className="p-4 space-x-2">

                  <Link
                    to={`/admin/edit-product/${product.id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() =>
                      handleDelete(product.id)
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
  );
};

export default ManageProducts;