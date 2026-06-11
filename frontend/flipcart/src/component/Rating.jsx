import React from "react";

const Rating = ({ value }) => {
  return (
    <span className="bg-green-600 text-white px-2 py-1 rounded text-sm">
      ⭐ {value}
    </span>
  );
};

export default Rating;