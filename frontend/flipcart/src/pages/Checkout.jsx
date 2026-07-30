import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CreditCard, CheckCircle2, MapPin, Truck } from "lucide-react";
import { API_URL } from "../services/api";

const Checkout = () => {
  const navigate = useNavigate();

  const userInfo = JSON.parse(
    localStorage.getItem("userInfo") || "null"
  );

  const [cart, setCart] = useState(null);

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const getCart = async () => {
    if (!userInfo) return;
    try {
      const res = await axios.get(
        `${API_URL}/api/cart/${userInfo._id}`
      );
      setCart(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (userInfo) {
      getCart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };

  const placeOrder = async () => {
    if (!address.fullName || !address.phone || !address.address) {
      alert("Please fill in shipping address fields");
      return;
    }

    try {
      await axios.post(
        `${API_URL}/api/orders/add`,
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

      alert("Order placed successfully!");
      navigate("/orders");
    } catch (error) {
      console.log(error);
      alert("Failed to place order. Please try again.");
    }
  };

  if (!cart) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-800/80 border border-slate-700/60 backdrop-blur-md">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit'] flex items-center gap-3">
          <CreditCard className="w-7 h-7 text-purple-400" />
          <span>Checkout & Shipping</span>
        </h1>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Shipping Form */}
        <div className="bg-slate-800/90 p-6 sm:p-8 rounded-3xl border border-slate-700/60 shadow-xl space-y-4 backdrop-blur-md">
          <h2 className="text-xl font-bold text-white font-['Outfit'] flex items-center gap-2 border-b border-slate-700/60 pb-3">
            <MapPin className="w-5 h-5 text-blue-400" />
            <span>Shipping Address</span>
          </h2>

          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3.5 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-blue-500"
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3.5 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-blue-500"
          />

          <textarea
            name="address"
            placeholder="Delivery Address"
            rows="3"
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3.5 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-blue-500"
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              name="city"
              placeholder="City"
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3.5 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-blue-500"
            />

            <input
              type="text"
              name="pincode"
              placeholder="Pincode"
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3.5 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Order Summary & Payment */}
        <div className="bg-slate-800/90 p-6 sm:p-8 rounded-3xl border border-slate-700/60 shadow-xl flex flex-col justify-between backdrop-blur-md space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white font-['Outfit'] border-b border-slate-700/60 pb-3 flex items-center gap-2">
              <Truck className="w-5 h-5 text-purple-400" />
              <span>Order Summary</span>
            </h2>

            <div className="space-y-3 mt-4 text-sm max-h-60 overflow-y-auto pr-1">
              {cart.items?.map((item) => (
                <div
                  key={item.product._id}
                  className="flex justify-between items-center bg-slate-900/80 p-3 rounded-xl border border-slate-700/50"
                >
                  <span className="font-medium text-white text-xs sm:text-sm line-clamp-1 flex-1 pr-2">
                    {item.product.name} × {item.quantity}
                  </span>

                  <span className="font-bold text-blue-400 text-sm">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-700/60 mt-6 space-y-2">
              <div className="flex justify-between text-slate-300 text-sm">
                <span>Payment Method</span>
                <span className="text-purple-300 font-semibold">Cash On Delivery (COD)</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-white pt-2">
                <span>Total Amount</span>
                <span className="text-xl text-blue-400 font-['Outfit']">₹{cart.totalPrice?.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <button
            onClick={placeOrder}
            className="w-full btn-primary-gradient py-4 rounded-xl font-semibold text-white text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Confirm Order (Cash On Delivery)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;