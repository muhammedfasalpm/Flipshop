import React, { useEffect, useState } from "react";
import axios from "axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  const userInfo = JSON.parse(
    localStorage.getItem("userInfo")
  );

  useEffect(() => {
    getOrders();
  }, []);

  const getOrders = async () => {
    try {
      const res = await axios.get(
        "http://localhost:4000/api/orders/get"
      );

      // Logged in usernte orders mathram
      const userOrders = res.data.filter(
        (order) => order.user._id === userInfo._id
      );

      setOrders(userOrders);
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
      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold mb-8">
          My Orders
        </h1>

        {orders.length === 0 ? (
          <div className="text-center text-2xl">
            No Orders Found
          </div>
        ) : (
          <div className="space-y-6">

            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded shadow p-6"
              >

                <div className="flex justify-between mb-4">
                  <h2 className="font-bold">
                    Order ID:
                  </h2>

                  <span>
                    {order._id}
                  </span>
                </div>

                <div className="flex justify-between mb-4">
                  <h2 className="font-bold">
                    Status
                  </h2>

                  <span className="text-blue-600">
                    {order.orderStatus}
                  </span>
                </div>

                <div className="flex justify-between mb-4">
                  <h2 className="font-bold">
                    Payment
                  </h2>

                  <span>
                    {order.paymentMethod}
                  </span>
                </div>

                <div className="flex justify-between mb-4">
                  <h2 className="font-bold">
                    Total Price
                  </h2>

                  <span className="text-green-600 font-bold">
                    ₹{order.totalPrice}
                  </span>
                </div>

                <hr className="my-4" />

                <h2 className="font-bold mb-3">
                  Products
                </h2>

                {order.items.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between mb-2"
                  >
                    <span>
                      {item.product?.name}
                    </span>

                    <span>
                      {item.quantity} × ₹
                      {item.price}
                    </span>
                  </div>
                ))}

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
};

export default Orders;