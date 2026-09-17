import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./components/AdminLayout";
import { API_URL } from "../services/api";

const AddProduct = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    brand: "",
    price: "",
    stock: "",
  });

  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  useEffect(() => {
    let ignore = false;
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
    fetchCategories();
    return () => {
      ignore = true;
    };
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    setImages(files);

    const previews = files.map((file) =>
      URL.createObjectURL(file)
    );

    setPreviewImages(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.description ||
      !formData.category ||
      !formData.brand ||
      !formData.price ||
      !formData.stock
    ) {
      alert("Please fill all fields");
      return;
    }

    if (images.length === 0) {
      alert("Please select at least one image");
      return;
    }

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

      const res = await axios.post(
        `${API_URL}/api/products/add`,
        data,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );


      alert(res.data.message);

      setFormData({
        name: "",
        description: "",
        category: "",
        brand: "",
        price: "",
        stock: "",
      });

      setImages([]);
      setPreviewImages([]);

      navigate("/admin/products");
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Failed to add product"
      );
    }
  };
    return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow mt-5">
        <h1 className="text-3xl font-bold mb-8">
          Add Product
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* Category */}
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

          {/* Product Name */}
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-3 rounded"
            required
          />

          {/* Description */}
          <textarea
            name="description"
            placeholder="Description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            className="w-full border p-3 rounded"
            required
          />

          {/* Brand */}
          <input
            type="text"
            name="brand"
            placeholder="Brand"
            value={formData.brand}
            onChange={handleChange}
            className="w-full border p-3 rounded"
            required
          />

          {/* Price */}
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            className="w-full border p-3 rounded"
            required
          />

          {/* Stock */}
          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={formData.stock}
            onChange={handleChange}
            className="w-full border p-3 rounded"
            required
          />

          {/* Images */}
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border p-3 rounded"
          />

          {/* Image Preview */}
          {previewImages.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {previewImages.map(
                (image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt="Preview"
                    className="h-28 w-full object-cover rounded border"
                  />
                )
              )}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
          >
            Add Product
          </button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AddProduct;