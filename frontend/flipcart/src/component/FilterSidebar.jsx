import React from "react";

const FilterSidebar = ({
  category,
  setCategory,
  sort,
  setSort,
}) => {
  return (
    <div className="bg-white p-4 rounded shadow">

      <h2 className="text-xl font-bold mb-4">
        Filters
      </h2>

      <select
        value={category}
        onChange={(e) =>
          setCategory(e.target.value)
        }
        className="w-full border p-2 rounded mb-4"
      >
        <option>All</option>
        <option>Mobiles</option>
        <option>Fashion</option>
        <option>Electronics</option>
      </select>

      <select
        value={sort}
        onChange={(e) =>
          setSort(e.target.value)
        }
        className="w-full border p-2 rounded"
      >
        <option value="">
          Sort By
        </option>

        <option value="lowToHigh">
          Price Low To High
        </option>

        <option value="highToLow">
          Price High To Low
        </option>
      </select>

    </div>
  );
};

export default FilterSidebar;