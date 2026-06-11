import React, { useState } from "react";

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([
   {
    id: 1,
    name: "iPhone 15 Pro Max",
    price: 129999,
    image:
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500",
    rating: 4.8,
  },
  {
    id: 2,
    name: "Nike Air Max",
    price: 4999,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
    rating: 4.5,
  },
  {
    id: 3,
    name: "Samsung Galaxy S24",
    price: 74999,
    image:
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500",
    rating: 4.7,
  },
  ]);

  const removeItem = (id) => {
    setWishlistItems(
      wishlistItems.filter((item) => item.id !== id)
    );
  };

  const moveToCart = (id) => {
    alert("Product moved to cart");
    removeItem(id);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-3xl font-bold mb-6">
          My Wishlist
        </h1>

        {wishlistItems.length === 0 ? (
          <div className="bg-white p-10 rounded shadow text-center">
            <h2 className="text-2xl font-semibold">
              Your Wishlist Is Empty
            </h2>

            <p className="text-gray-500 mt-2">
              Add products to your wishlist.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {wishlistItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded shadow overflow-hidden"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-60 object-cover"
                />

                <div className="p-4">

                  <h2 className="text-lg font-semibold">
                    {item.name}
                  </h2>

                  <div className="flex items-center gap-2 mt-2">
                    <span className="bg-green-600 text-white px-2 py-1 rounded text-sm">
                      ⭐ {item.rating}
                    </span>
                  </div>

                  <p className="text-green-600 text-xl font-bold mt-3">
                    ₹{item.price}
                  </p>

                  <div className="flex gap-2 mt-5">

                    <button
                      onClick={() =>
                        moveToCart(item.id)
                      }
                      className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    >
                      Move To Cart
                    </button>

                    <button
                      onClick={() =>
                        removeItem(item.id)
                      }
                      className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600"
                    >
                      Remove
                    </button>

                  </div>

                </div>
              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
};

export default Wishlist;