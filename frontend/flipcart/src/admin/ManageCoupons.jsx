import React, { useState } from "react";
import AdminLayout from "./components/AdminLayout";

const ManageCoupons = () => {
  const [formData, setFormData] = useState({
    code: "",
    discount: "",
    expiry: "",
  });

  const [coupons, setCoupons] = useState([
    {
      id: 1,
      code: "WELCOME10",
      discount: 10,
      expiry: "2026-12-31",
    },
    {
      id: 2,
      code: "SALE20",
      discount: 20,
      expiry: "2026-10-15",
    },
  ]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newCoupon = {
      id: Date.now(),
      ...formData,
    };

    setCoupons([...coupons, newCoupon]);

    setFormData({
      code: "",
      discount: "",
      expiry: "",
    });
  };

  const deleteCoupon = (id) => {
    setCoupons(
      coupons.filter(
        (coupon) => coupon.id !== id
      )
    );
  };

  return (
    <AdminLayout>
    <div className="min-h-screen bg-gray-100 p-6">

      <h1 className="text-3xl font-bold mb-8">
        Manage Coupons
      </h1>

      {/* Add Coupon Form */}
      <div className="bg-white p-6 rounded shadow mb-8">

        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-4 gap-4"
        >

          <input
            type="text"
            name="code"
            placeholder="Coupon Code"
            value={formData.code}
            onChange={handleChange}
            className="border p-3 rounded"
            required
          />

          <input
            type="number"
            name="discount"
            placeholder="Discount %"
            value={formData.discount}
            onChange={handleChange}
            className="border p-3 rounded"
            required
          />

          <input
            type="date"
            name="expiry"
            value={formData.expiry}
            onChange={handleChange}
            className="border p-3 rounded"
            required
          />

          <button
            type="submit"
            className="bg-green-600 text-white rounded"
          >
            Add Coupon
          </button>

        </form>

      </div>

      {/* Coupon Table */}
      <div className="bg-white rounded shadow overflow-x-auto">

        <table className="w-full">

          <thead className="bg-gray-200">

            <tr>
              <th className="p-4">
                Coupon Code
              </th>

              <th className="p-4">
                Discount
              </th>

              <th className="p-4">
                Expiry Date
              </th>

              <th className="p-4">
                Action
              </th>
            </tr>

          </thead>

          <tbody>

            {coupons.map((coupon) => (
              <tr
                key={coupon.id}
                className="border-b text-center"
              >
                <td className="p-4 font-semibold">
                  {coupon.code}
                </td>

                <td className="p-4 text-green-600 font-bold">
                  {coupon.discount}%
                </td>

                <td className="p-4">
                  {coupon.expiry}
                </td>

                <td className="p-4">

                  <button
                    onClick={() =>
                      deleteCoupon(coupon.id)
                    }
                    className="bg-red-600 text-white px-4 py-2 rounded"
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

export default ManageCoupons;