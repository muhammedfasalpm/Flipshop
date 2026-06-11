import React, { useState } from "react";

const Checkout = () => {
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const orderItems = [
    {
      id: 1,
      name: "iPhone 15 Pro Max",
      price: 129999,
      quantity: 1,
    },
    {
      id: 2,
      name: "Nike Shoes",
      price: 4999,
      quantity: 2,
    },
  ];

  const subtotal = orderItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const shipping = 0;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-3xl font-bold mb-6">
          Checkout
        </h1>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* Address Section */}
          <div className="lg:col-span-2 space-y-6">

            <div className="bg-white p-5 rounded shadow">
              <h2 className="text-xl font-bold mb-4">
                Delivery Address
              </h2>

              <div className="border p-4 rounded">
                <h3 className="font-semibold">
                  Fasal PK
                </h3>

                <p>
                  ABC House, Thrissur,
                  Kerala - 680001
                </p>

                <p>Phone: 9876543210</p>
              </div>

              <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
                Add New Address
              </button>
            </div>

            {/* Payment Section */}
            <div className="bg-white p-5 rounded shadow">

              <h2 className="text-xl font-bold mb-4">
                Payment Method
              </h2>

              <div className="space-y-3">

                <label className="flex gap-2">
                  <input
                    type="radio"
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value)
                    }
                  />
                  Cash On Delivery
                </label>

                <label className="flex gap-2">
                  <input
                    type="radio"
                    value="UPI"
                    checked={paymentMethod === "UPI"}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value)
                    }
                  />
                  UPI Payment
                </label>

                <label className="flex gap-2">
                  <input
                    type="radio"
                    value="Card"
                    checked={paymentMethod === "Card"}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value)
                    }
                  />
                  Credit / Debit Card
                </label>

              </div>

            </div>

          </div>

          {/* Order Summary */}
          <div>

            <div className="bg-white p-5 rounded shadow">

              <h2 className="text-xl font-bold mb-4">
                Order Summary
              </h2>

              {orderItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between mb-3"
                >
                  <span>
                    {item.name} x {item.quantity}
                  </span>

                  <span>
                    ₹
                    {item.price * item.quantity}
                  </span>
                </div>
              ))}

              <hr className="my-4" />

              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>

              <div className="flex justify-between mb-2">
                <span>Shipping</span>
                <span>Free</span>
              </div>

              <hr className="my-4" />

              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>₹{total}</span>
              </div>

              <button className="w-full mt-5 bg-green-600 text-white py-3 rounded hover:bg-green-700">
                Place Order
              </button>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Checkout;