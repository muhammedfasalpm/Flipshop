import React, { useState } from "react";

const ProductDetails = () => {
  const product = {
    id: 1,
    name: "iPhone 15 Pro Max",
    price: 129999,
    oldPrice: 139999,
    rating: 4.7,
    stock: "In Stock",
    description:
      "The iPhone 15 Pro Max features a titanium design, A17 Pro chip, advanced camera system, and all-day battery life.",
  images: [
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600",
    "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600",
    "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600",
    "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600",
  ],

    specifications: {
      Brand: "Apple",
      Display: "6.7 inch OLED",
      Processor: "A17 Pro",
      Storage: "256GB",
      Camera: "48MP + 12MP + 12MP",
      Battery: "4441 mAh",
    },
  };

  const [selectedImage, setSelectedImage] = useState(
    product.images[0]
  );

  return (
    <div className="bg-gray-100 min-h-screen p-5">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow p-6">

        <div className="grid md:grid-cols-2 gap-10">

          {/* Images Section */}
          <div>

            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-[500px] object-cover border rounded"
            />

            <div className="flex gap-3 mt-4">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt="product"
                  onClick={() => setSelectedImage(image)}
                  className={`w-20 h-20 border rounded cursor-pointer ${
                    selectedImage === image
                      ? "border-blue-600"
                      : ""
                  }`}
                />
              ))}
            </div>

          </div>

          {/* Product Info */}
          <div>

            <h1 className="text-3xl font-bold">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mt-3">
              <span className="bg-green-600 text-white px-2 py-1 rounded text-sm">
                ⭐ {product.rating}
              </span>

              <span className="text-green-600 font-semibold">
                {product.stock}
              </span>
            </div>

            <div className="mt-5">
              <span className="text-4xl font-bold text-green-600">
                ₹{product.price}
              </span>

              <span className="ml-4 text-gray-400 line-through text-xl">
                ₹{product.oldPrice}
              </span>
            </div>

            <div className="mt-6">
              <h2 className="font-bold text-xl mb-2">
                Description
              </h2>

              <p className="text-gray-600">
                {product.description}
              </p>
            </div>

            <div className="flex gap-4 mt-8">

              <button className="flex-1 bg-yellow-500 text-white py-3 rounded font-semibold hover:bg-yellow-600">
                Add To Cart
              </button>

              <button className="flex-1 bg-orange-500 text-white py-3 rounded font-semibold hover:bg-orange-600">
                Buy Now
              </button>

            </div>

          </div>

        </div>

        {/* Specifications */}
        <div className="mt-12">

          <h2 className="text-2xl font-bold mb-5">
            Specifications
          </h2>

          <div className="border rounded overflow-hidden">

            {Object.entries(product.specifications).map(
              ([key, value]) => (
                <div
                  key={key}
                  className="grid grid-cols-2 border-b p-4"
                >
                  <div className="font-semibold">
                    {key}
                  </div>

                  <div>{value}</div>
                </div>
              )
            )}

          </div>

        </div>

        {/* Related Products */}
        <div className="mt-12">

          <h2 className="text-2xl font-bold mb-5">
            Related Products
          </h2>

          <div className="grid md:grid-cols-4 gap-5">

            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="bg-white border rounded shadow-sm overflow-hidden"
              >
                <img
                  src="https://via.placeholder.com/250"
                  alt="related"
                  className="w-full h-48 object-cover"
                />

                <div className="p-4">
                  <h3 className="font-semibold">
                    Product {item}
                  </h3>

                  <p className="text-green-600 font-bold mt-2">
                    ₹9999
                  </p>

                  <button className="w-full mt-3 bg-blue-600 text-white py-2 rounded">
                    View Product
                  </button>
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