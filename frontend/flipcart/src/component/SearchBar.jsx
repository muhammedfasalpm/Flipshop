import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();

    if (!search.trim()) return;

    navigate(`/products?search=${search}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex w-full"
    >
      <input
        type="text"
        placeholder="Search for products, brands and more"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-2 outline-none rounded-l-md text-black"
      />

      <button
        type="submit"
        className="bg-yellow-400 px-5 rounded-r-md hover:bg-yellow-500"
      >
        🔍
      </button>
    </form>
  );
};

export default SearchBar;