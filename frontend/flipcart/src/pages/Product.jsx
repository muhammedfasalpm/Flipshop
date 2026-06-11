
import React, { useState } from "react";
import { productsData } from "../Constant/Product.js";



const Products = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("");

  let filteredProducts = productsData.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || product.category === category;

    return matchesSearch && matchesCategory;
  });

  if (sort === "lowToHigh") {
    filteredProducts.sort((a, b) => a.price - b.price);
  }

  if (sort === "highToLow") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  return (
    <div className="bg-gray-100 min-h-screen p-5">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-3xl font-bold mb-6">
          All Products
        </h1>

        <div className="grid md:grid-cols-4 gap-6">

          {/* Sidebar */}
          <div className="bg-white p-4 rounded shadow h-fit">

            <h2 className="font-bold text-xl mb-4">
              Filters
            </h2>

            {/* Search */}
            <input
              type="text"
              placeholder="Search Product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border p-2 rounded mb-4"
            />

            {/* Category */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border p-2 rounded mb-4"
            >
              <option>All</option>
              <option>Mobiles</option>
              <option>Fashion</option>
              <option>Electronics</option>
            </select>

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="">Sort By</option>
              <option value="lowToHigh">
                Price Low To High
              </option>
              <option value="highToLow">
                Price High To Low
              </option>
            </select>

          </div>

          {/* Products Grid */}
          <div className="md:col-span-3">

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded shadow hover:shadow-lg overflow-hidden"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-56 object-cover"
                  />

                  <div className="p-4">
                    <h2 className="font-semibold text-lg">
                      {product.name}
                    </h2>

                    <p className="text-gray-500">
                      {product.category}
                    </p>

                    <p className="text-green-600 font-bold text-xl mt-2">
                      ₹{product.price}
                    </p>

                    <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                      Add To Cart
                    </button>
                  </div>
                </div>
              ))}

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Products;