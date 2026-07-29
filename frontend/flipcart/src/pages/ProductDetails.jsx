
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);

  const userInfo = JSON.parse(
    localStorage.getItem("userInfo")
  );

  useEffect(() => {
    getProduct();
    getProducts();
  }, [id]);

  const getProduct = async () => {
    try {
      const res = await axios.get(
        `http://localhost:4000/api/products/getone/${id}`
      );

      setProduct(res.data);

      if (res.data.images?.length > 0) {
        setSelectedImage(
          `http://localhost:4000/${res.data.images[0]}`
        );
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const getProducts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:4000/api/products/get"
      );

      setProducts(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddToCart = async () => {
    try {
      if (!userInfo) {
        alert("Please login first");
        navigate("/login");
        return;
      }

      await axios.post(
        "http://localhost:4000/api/cart/add",
        {
          userId: userInfo._id,
          productId: product._id,
          quantity: 1,
        }
      );

      alert("Added to cart");
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        Loading...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        Product not found
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-5">
      <div className="max-w-7xl mx-auto bg-white p-6 rounded shadow">

        <div className="grid md:grid-cols-2 gap-10">

          {/* Images */}
          <div>

            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-[500px] object-cover border rounded"
            />

            <div className="flex gap-3 mt-4">

              {product.images?.map((image, index) => (
                <img
                  key={index}
                  src={`http://localhost:4000/${image}`}
                  alt=""
                  onClick={() =>
                    setSelectedImage(
                      `http://localhost:4000/${image}`
                    )
                  }
                  className="w-20 h-20 border rounded cursor-pointer"
                />
              ))}

            </div>

          </div>

          {/* Details */}
          <div>

            <h1 className="text-3xl font-bold">
              {product.name}
            </h1>

            <p className="text-gray-500 mt-2">
              {product.category}
            </p>

            <p className="text-green-600 text-4xl font-bold mt-5">
              ₹{product.price}
            </p>

            <p className="mt-5 text-gray-700">
              {product.description}
            </p>

            <div className="mt-6 space-y-2">
              <p>
                <strong>Brand:</strong> {product.brand}
              </p>

              <p>
                <strong>Stock:</strong> {product.stock}
              </p>
            </div>

            <div className="flex gap-4 mt-8">

              <button
                onClick={handleAddToCart}
                className="flex-1 bg-yellow-500 text-white py-3 rounded"
              >
                Add To Cart
              </button>

              <button
                className="flex-1 bg-orange-500 text-white py-3 rounded"
              >
                Buy Now
              </button>

            </div>

          </div>

        </div>

        {/* Related Products */}
        <div className="mt-12">

          <h2 className="text-2xl font-bold mb-5">
            Related Products
          </h2>

          <div className="grid md:grid-cols-4 gap-5">

            {products
              .filter(
                (item) => item._id !== product._id
              )
              .slice(0, 4)
              .map((item) => (
                <div
                  key={item._id}
                  className="bg-white border rounded shadow overflow-hidden"
                >

                  <img
                    src={`http://localhost:4000/${item.images?.[0]}`}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />

                  <div className="p-4">

                    <h3 className="font-semibold">
                      {item.name}
                    </h3>

                    <p className="text-green-600 font-bold mt-2">
                      ₹{item.price}
                    </p>

                    <Link
                      to={`/product/${item._id}`}
                      className="block text-center mt-3 bg-blue-600 text-white py-2 rounded"
                    >
                      View Product
                    </Link>

                  </div>

                </div>
              ))}

          </div>

        </div>

      </div>
    </div>
  );
};

export default ProductDetails;

