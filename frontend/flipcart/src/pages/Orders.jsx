import React from "react";
import { orders } from "../Constant/Product.js";


const Orders = () => {


  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "text-green-600";
      case "Shipped":
        return "text-blue-600";
      case "Processing":
        return "text-orange-500";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          My Orders
        </h1>

        <div className="space-y-5">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow p-5"
            >
              <div className="flex flex-col md:flex-row gap-5">

                <img
                  src={order.image}
                  alt={order.product}
                  className="w-36 h-36 rounded object-cover"
                />

                <div className="flex-1">

                  <h2 className="text-xl font-semibold">
                    {order.product}
                  </h2>

                  <p className="text-gray-500 mt-2">
                    Order ID: {order.id}
                  </p>

                  <p className="text-gray-500">
                    Order Date: {order.date}
                  </p>

                  <p
                    className={`font-semibold mt-2 ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </p>

                  <p className="text-green-600 text-xl font-bold mt-2">
                    ₹{order.amount}
                  </p>

                </div>

                <div className="flex flex-col gap-3 justify-center">

                  <button className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700">
                    View Details
                  </button>

                  {order.status !== "Delivered" && (
                    <button className="bg-red-500 text-white px-5 py-2 rounded hover:bg-red-600">
                      Cancel Order
                    </button>
                  )}

                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Orders;