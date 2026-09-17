import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Package, ShoppingBag, ArrowRight } from "lucide-react";
import { API_URL } from "../services/api";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  const userInfo = JSON.parse(
    localStorage.getItem("userInfo") || "null"
  );
  const [loading, setLoading] = useState(Boolean(userInfo));

  const getOrders = async () => {
    if (!userInfo) return;
    try {
      const res = await axios.get(`${API_URL}/api/orders/get`);
      const userOrders = (res.data || []).filter(
        (order) => order.user?._id === userInfo._id || order.user === userInfo._id
      );
      setOrders(userOrders);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo) {
      getOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!userInfo) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-purple-600/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4">
          <Package className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white font-['Outfit']">Sign In to View Orders</h2>
        <p className="text-slate-400 text-sm mt-1 mb-6">Please log in to track your order history.</p>
        <Link to="/login" className="btn-primary-gradient px-6 py-3 rounded-xl font-semibold text-sm">
          Sign In Now
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-800/80 border border-slate-700/60 backdrop-blur-md flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit'] flex items-center gap-3">
            <Package className="w-7 h-7 text-purple-400" />
            <span>My Orders ({orders.length})</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">Track your recent orders and delivery status.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-slate-800/60 rounded-3xl border border-slate-700/60 backdrop-blur-md">
          <ShoppingBag className="w-12 h-12 text-slate-500 mb-3" />
          <h3 className="text-xl font-bold text-white font-['Outfit']">No Orders Placed Yet</h3>
          <p className="text-slate-400 text-sm mt-1 mb-6">Explore our catalog to place your first order.</p>
          <Link to="/products" className="btn-primary-gradient px-6 py-3 rounded-xl font-semibold text-sm flex items-center gap-2">
            <span>Explore Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-slate-800/90 rounded-3xl border border-slate-700/60 p-6 space-y-4 backdrop-blur-md shadow-xl"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-700/60 pb-4">
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Order Reference</span>
                  <p className="text-sm font-mono font-bold text-white mt-0.5">{order._id}</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    order.orderStatus === "Delivered"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                  }`}>
                    {order.orderStatus || "Processing"}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Items Ordered</h3>
                <div className="space-y-2">
                  {order.items?.map((item, idx) => (
                    <div
                      key={item._id || idx}
                      className="flex justify-between items-center bg-slate-900/80 p-3 rounded-xl border border-slate-700/50 text-sm"
                    >
                      <span className="font-semibold text-white">
                        {item.product?.name || "Product Item"}
                      </span>
                      <span className="text-slate-300 text-xs">
                        {item.quantity} × ₹{item.price?.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-700/60 text-sm">
                <span className="text-slate-400">Payment: <strong className="text-white font-medium">{order.paymentMethod || "COD"}</strong></span>
                <span className="text-base font-extrabold text-white">
                  Total: <span className="text-blue-400 font-['Outfit'] text-lg">₹{order.totalPrice?.toLocaleString()}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;