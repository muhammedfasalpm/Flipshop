import React from "react";

const ManageOrders = () => {
  const orders = [
    {
      id: "ORD123456",
      customer: "Fasal PK",
      product: "iPhone 15 Pro Max",
      amount: 129999,
      status: "Pending",
    },
    {
      id: "ORD123457",
      customer: "Rahul",
      product: "Nike Air Max",
      amount: 4999,
      status: "Shipped",
    },
    {
      id: "ORD123458",
      customer: "Arun",
      product: "Samsung Galaxy S24",
      amount: 74999,
      status: "Delivered",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <h1 className="text-3xl font-bold mb-8">
        Manage Orders
      </h1>

      <div className="bg-white rounded shadow overflow-x-auto">

        <table className="w-full">

          <thead className="bg-gray-200">

            <tr>
              <th className="p-4">Order ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Product</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>

          </thead>

          <tbody>

            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b text-center"
              >
                <td className="p-4">
                  {order.id}
                </td>

                <td className="p-4">
                  {order.customer}
                </td>

                <td className="p-4">
                  {order.product}
                </td>

                <td className="p-4 text-green-600 font-bold">
                  ₹{order.amount}
                </td>

                <td className="p-4">

                  <select
                    defaultValue={order.status}
                    className="border p-2 rounded"
                  >
                    <option>
                      Pending
                    </option>

                    <option>
                      Processing
                    </option>

                    <option>
                      Shipped
                    </option>

                    <option>
                      Delivered
                    </option>

                    <option>
                      Cancelled
                    </option>

                  </select>

                </td>

                <td className="p-4">

                  <button className="bg-blue-600 text-white px-4 py-2 rounded">
                    Update
                  </button>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default ManageOrders;