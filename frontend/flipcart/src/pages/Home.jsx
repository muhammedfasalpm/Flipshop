import React from "react";

import HeroSlider from "../component/HeroBanner";
import CategorySection from "../component/CategorySection";
import ProductGrid from "../component/ProductGrid";
import {products} from "../Constant/Product.js";


const Home = () => {
  return (
    <div className="bg-gray-100 min-h-screen">

      {/* Hero Slider */}
      <HeroSlider />

      <div className="max-w-7xl mx-auto px-4">

        {/* Categories */}
        <CategorySection />

        {/* Trending Products */}
        <div className="mt-8 bg-white p-5 rounded shadow">
          <h2 className="text-2xl font-bold mb-5">
            Trending Products
          </h2>

          <ProductGrid products={products.slice(0, 4)} />
        </div>

        {/* Best Sellers */}
        <div className="mt-8 bg-white p-5 rounded shadow">
          <h2 className="text-2xl font-bold mb-5">
            Best Sellers
          </h2>

          <ProductGrid products={products.slice(4, 8)} />
        </div>

        {/* Deals Of The Day */}
        <div className="mt-8 bg-white p-5 rounded shadow mb-8">
          <h2 className="text-2xl font-bold mb-5">
            Deals Of The Day
          </h2>

          <ProductGrid products={products} />
        </div>

      </div>

    </div>
  );
};

export default Home;