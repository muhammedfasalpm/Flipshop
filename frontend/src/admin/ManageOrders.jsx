import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "./components/AdminLayout";
import { API_URL } from "../services/api";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);

  const getOrders = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/orders/get`
      );

      setOrders(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    let ignore = false;
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/orders/get`
        );
        if (!ignore) {
          setOrders(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchOrders();
    return () => {
      ignore = true;
    };
  }, []);

  const updateStatus = async (
    id,
    orderStatus
  ) => {
    try {
      await axios.put(
        `${API_URL}/api/orders/update/${id}`,
        {
          orderStatus,
        }
      );

      getOrders();

      alert("Order status updated");
    } catch (error) {
      console.log(error);
    }
  };

  const deleteOrder = async (id) => {
    if (
      !window.confirm(
        "Delete this order?"
      )
    ) {
      return;
    }

    try {
      await axios.delete(
        `${API_URL}/api/orders/delete/${id}`
      );

      getOrders();

      alert("Order deleted");
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-100 p-6">

        <h1 className="text-3xl font-bold mb-8">
          Manage Orders
        </h1>

        <div className="bg-white rounded shadow overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-200">
              <tr>
                <th className="p-4">
                  Customer
                </th>

                <th className="p-4">
                  Total
                </th>

                <th className="p-4">
                  Payment
                </th>

                <th className="p-4">
                  Status
                </th>

                <th className="p-4">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>

              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b text-center"
                >
                  <td className="p-4">
                    {order.user?.name}
                  </td>

                  <td>
                    ₹{order.totalPrice}
                  </td>

                  <td>
                    {order.paymentMethod}
                  </td>

                  <td>
                    <select
                      value={
                        order.orderStatus
                      }
                      onChange={(e) =>
                        updateStatus(
                          order._id,
                          e.target.value
                        )
                      }
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

                  <td>
                    <button
                      onClick={() =>
                        deleteOrder(
                          order._id
                        )
                      }
                      className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>
    </AdminLayout>
  );
};

export default ManageOrders;