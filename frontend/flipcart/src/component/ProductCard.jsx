import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">

      {/* Product Image */}
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-56 object-cover"
      />

      {/* Product Info */}
      <div className="p-4">

        <h2 className="font-semibold text-lg line-clamp-1">
          {product.name}
        </h2>

        <div className="flex items-center gap-2 mt-2">

          <span className="bg-green-600 text-white text-sm px-2 py-1 rounded">
            ⭐ {product.rating}
          </span>

        </div>

        <p className="text-green-600 text-xl font-bold mt-3">
          ₹{product.price}
        </p>

        <div className="flex gap-2 mt-4">

          <button className="flex-1 bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600">
            Add To Cart
          </button>

          <Link
            to={`/product/${product.id}`}
            className="flex-1"
          >
            <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
              View
            </button>
          </Link>

        </div>

      </div>

    </div>
  );
};

export default ProductCard;