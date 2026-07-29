
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AdminLayout from "./components/AdminLayout";
import { API_URL, getImageUrl } from "../services/api";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/products/get`
      );

      setProducts(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this product?"
      )
    ) {
      return;
    }

    try {
      await axios.delete(
        `${API_URL}/api/products/delete/${id}`
      );

      getProducts();

      alert("Product deleted successfully");
    } catch (error) {
      console.log(error);
      alert("Failed to delete product");
    }
  };


  return (
    <AdminLayout>
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
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>

            <tbody>

              {products.map((product) => (
                <tr
                  key={product._id}
                  className="border-b text-center"
                >

                  <td className="p-4">
                    <img
                      src={getImageUrl(product.images?.[0])}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded mx-auto"
                    />

                  </td>

                  <td>{product.name}</td>

                  <td>{product.category}</td>

                  <td className="text-green-600 font-bold">
                    ₹{product.price}
                  </td>

                  <td>{product.stock}</td>

                  <td className="space-x-2">

                    <Link
                      to={`/admin/edit-product/${product._id}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() =>
                        handleDelete(product._id)
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

export default ManageProducts;

