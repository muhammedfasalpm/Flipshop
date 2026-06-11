import React, { useState } from "react";

const Cart = () => {
  const [cartItems, setCartItems] = useState([
{
    id: 1,
    name: "iPhone 15 Pro Max",
    price: 129999,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500",
  },
  {
    id: 2,
    name: "Nike Running Shoes",
    price: 4999,
    quantity: 2,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
  },
  ]);

  const increaseQty = (id) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(
      cartItems.filter((item) => item.id !== id)
    );
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const shipping = subtotal > 1000 ? 0 : 100;

  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-3xl font-bold mb-6">
          My Cart
        </h1>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* Cart Items */}
          <div className="lg:col-span-2">

            {cartItems.length === 0 ? (
              <div className="bg-white p-10 rounded shadow text-center">
                <h2 className="text-2xl font-semibold">
                  Cart is Empty
                </h2>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded shadow p-4 mb-4 flex flex-col md:flex-row gap-4"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-40 h-40 object-cover rounded"
                  />

                  <div className="flex-1">
                    <h2 className="text-xl font-semibold">
                      {item.name}
                    </h2>

                    <p className="text-green-600 font-bold mt-2">
                      ₹{item.price}
                    </p>

                    {/* Quantity */}
                    <div className="flex items-center gap-3 mt-4">

                      <button
                        onClick={() =>
                          decreaseQty(item.id)
                        }
                        className="bg-gray-200 px-3 py-1 rounded"
                      >
                        -
                      </button>

                      <span className="font-bold">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          increaseQty(item.id)
                        }
                        className="bg-gray-200 px-3 py-1 rounded"
                      >
                        +
                      </button>

                    </div>

                    <button
                      onClick={() =>
                        removeItem(item.id)
                      }
                      className="mt-4 text-red-500 font-semibold"
                    >
                      Remove
                    </button>

                  </div>
                </div>
              ))
            )}

          </div>

          {/* Price Summary */}
          <div>

            <div className="bg-white rounded shadow p-5">

              <h2 className="text-2xl font-bold mb-5">
                Price Details
              </h2>

              <div className="flex justify-between mb-3">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>

              <div className="flex justify-between mb-3">
                <span>Shipping</span>
                <span>
                  {shipping === 0
                    ? "Free"
                    : `₹${shipping}`}
                </span>
              </div>

              <hr className="my-4" />

              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>₹{total}</span>
              </div>

              <button className="w-full mt-6 bg-orange-500 text-white py-3 rounded hover:bg-orange-600">
                Proceed To Checkout
              </button>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Cart;