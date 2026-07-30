const RecentOrders = ({ orders = [] }) => {
  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
      {orders.length === 0 ? (
        <p className="text-gray-500 text-sm">No recent orders.</p>
      ) : (
        <ul className="space-y-2">
          {orders.slice(0, 5).map((order) => (
            <li key={order._id} className="border-b pb-2 flex justify-between text-sm">
              <span>{order.user?.name || "Customer"}</span>
              <span className="font-semibold text-blue-600">₹{order.totalPrice}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentOrders;
