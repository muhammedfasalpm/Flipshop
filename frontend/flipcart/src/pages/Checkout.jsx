import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const navigate = useNavigate();

  const userInfo = JSON.parse(
    localStorage.getItem("userInfo")
  );

  const [cart, setCart] = useState(null);

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  useEffect(() => {
    getCart();
  }, []);

  const getCart = async () => {
    try {
      const res = await axios.get(
        `http://localhost:4000/api/cart/${userInfo._id}`
      );

      setCart(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };

  const placeOrder = async () => {
    try {
      await axios.post(
        "http://localhost:4000/api/orders/add",
        {
          user: userInfo._id,
          items: cart.items.map((item) => ({
            product: item.product._id,
            quantity: item.quantity,
            price: item.price,
          })),
          shippingAddress: address,
          paymentMethod: "COD",
          totalPrice: cart.totalPrice,
        }
      );

      alert("Order placed successfully");

      navigate("/orders");
    } catch (error) {
      console.log(error);
    }
  };

  if (!cart) return <h1>Loading...</h1>;

  return (
    <div className="max-w-5xl mx-auto p-5">

      <h1 className="text-3xl font-bold mb-8">
        Checkout
      </h1>

      <div className="grid md:grid-cols-2 gap-10">

        <div className="bg-white p-5 rounded shadow space-y-4">

          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone"
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />

          <textarea
            name="address"
            placeholder="Address"
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />

          <input
            type="text"
            name="city"
            placeholder="City"
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />

          <input
            type="text"
            name="pincode"
            placeholder="Pincode"
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />

        </div>

        <div className="bg-white p-5 rounded shadow">

          <h2 className="text-2xl font-bold mb-5">
            Order Summary
          </h2>

          {cart.items.map((item) => (
            <div
              key={item.product._id}
              className="flex justify-between mb-3"
            >
              <span>
                {item.product.name} × {item.quantity}
              </span>

              <span>
                ₹{item.price * item.quantity}
              </span>
            </div>
          ))}

          <hr className="my-5" />

          <h2 className="text-xl font-bold">
            Total : ₹{cart.totalPrice}
          </h2>

          <button
            onClick={placeOrder}
            className="w-full bg-green-600 text-white py-3 rounded mt-6"
          >
            Place Order (COD)
          </button>

        </div>

      </div>

    </div>
  );
};

export default Checkout;