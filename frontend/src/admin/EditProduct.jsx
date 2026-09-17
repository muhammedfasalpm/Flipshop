
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "./components/AdminLayout";
import { API_URL, getImageUrl } from "../services/api";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    brand: "",
    price: "",
    stock: "",
  });

  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let ignore = false;

    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/products/getone/${id}`
        );
        if (!ignore) {
          const product = res.data;
          setFormData({
            name: product.name,
            description: product.description,
            category: product.category,
            brand: product.brand,
            price: product.price,
            stock: product.stock,
          });

          if (product.images?.length > 0) {
            setPreview(getImageUrl(product.images[0]));
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/categories/get`
        );
        if (!ignore) {
          setCategories(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchProduct();
    fetchCategories();

    return () => {
      ignore = true;
    };
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));

    if (e.target.files[0]) {
      setPreview(
        URL.createObjectURL(e.target.files[0])
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      data.append("name", formData.name);
      data.append(
        "description",
        formData.description
      );
      data.append("category", formData.category);
      data.append("brand", formData.brand);
      data.append("price", formData.price);
      data.append("stock", formData.stock);

      images.forEach((image) => {
        data.append("images", image);
      });

      await axios.put(
        `${API_URL}/api/products/update/${id}`,
        data,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );


      alert("Product updated successfully");

      navigate("/admin/products");
    } catch (error) {
      console.log(error);
      alert("Failed to update product");
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto bg-white p-8 rounded shadow">

        <h1 className="text-3xl font-bold mb-8">
          Edit Product
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Product Name"
            className="w-full border p-3 rounded"
            required
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full border p-3 rounded"
            required
          />

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border p-3 rounded"
            required
          >
            <option value="">
              Select Category
            </option>

            {categories.map((category) => (
              <option
                key={category._id}
                value={category.name}
              >
                {category.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            placeholder="Brand"
            className="w-full border p-3 rounded"
            required
          />

          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price"
            className="w-full border p-3 rounded"
            required
          />

          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            placeholder="Stock"
            className="w-full border p-3 rounded"
            required
          />

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border p-3 rounded"
          />

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-48 h-48 object-cover rounded border"
            />
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded"
          >
            Save Changes
          </button>

        </form>

      </div>
    </AdminLayout>
  );
};

export default EditProduct;
