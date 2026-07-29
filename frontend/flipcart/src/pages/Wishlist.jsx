
import React, { useEffect, useState } from "react";
import axios from "axios";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);

  const userInfo = JSON.parse(
    localStorage.getItem("userInfo")
  );

  useEffect(() => {
    if (userInfo) {
      getWishlist();
    }
  }, []);

  const getWishlist = async () => {
    try {
      const res = await axios.get(
        `http://localhost:4000/api/wishlist/${userInfo._id}`
      );

      setWishlist(res.data.products || []);
    } catch (error) {
      console.log(error);
    }
  };

  const removeFromWishlist = async (
    productId
  ) => {
    try {
      await axios.delete(
        `http://localhost:4000/api/wishlist/remove/${productId}`,
        {
          data: {
            userId: userInfo._id,
          },
        }
      );

      getWishlist();
    } catch (error) {
      console.log(error);
    }
  };

  const addToCart = async (productId) => {
    try {
      await axios.post(
        "http://localhost:4000/api/cart/add",
        {
          userId: userInfo._id,
          productId,
          quantity: 1,
        }
      );

      alert("Added to cart");
    } catch (error) {
      console.log(error);
    }
  };

  if (!userInfo) {
    return (
      <div className="text-center py-20 text-2xl">
        Please Login First
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-5">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-3xl font-bold mb-8">
          My Wishlist
        </h1>

        {wishlist.length === 0 ? (
          <div className="text-center text-2xl">
            Wishlist is Empty
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">

            {wishlist.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded shadow p-4"
              >

                <img
                  src={`http://localhost:4000/${product.images?.[0]}`}
                  alt={product.name}
                  className="w-full h-60 object-cover rounded"
                />

                <h2 className="text-xl font-bold mt-4">
                  {product.name}
                </h2>

                <p className="text-green-600 font-bold mt-2">
                  ₹{product.price}
                </p>

                <div className="flex gap-3 mt-5">

                  <button
                    onClick={() =>
                      addToCart(product._id)
                    }
                    className="flex-1 bg-yellow-500 text-white py-2 rounded"
                  >
                    Add To Cart
                  </button>

                  <button
                    onClick={() =>
                      removeFromWishlist(
                        product._id
                      )
                    }
                    className="flex-1 bg-red-500 text-white py-2 rounded"
                  >
                    Remove
                  </button>

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

