import React from "react";
import ProductCard from "./ProductCard";

const ProductGrid = ({
  products,
}) => {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">

      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
        />
      ))}

    </div>
  );
};

export default ProductGrid;