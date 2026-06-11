import React from "react";

const categories = [
  "Mobiles",
  "Fashion",
  "Electronics",
  "Appliances",
  "Beauty",
  "Toys",
  "Grocery",
];

const CategorySection = () => {
  return (
    <div className="bg-white p-5 mt-5 rounded shadow">

      <h2 className="text-2xl font-bold mb-5">
        Categories
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">

        {categories.map((item) => (
          <div
            key={item}
            className="bg-gray-100 p-4 rounded text-center hover:bg-blue-100 cursor-pointer"
          >
            {item}
          </div>
        ))}

      </div>

    </div>
  );
};

export default CategorySection;