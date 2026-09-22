import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, CheckCircle2, MapPin, Truck, Tag, X, Sparkles, Loader2 } from "lucide-react";
import api from "../services/api";

const Checkout = () => {
  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Coupon state
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [couponSuccessMsg, setCouponSuccessMsg] = useState("");

  const [address, setAddress] = useState({
    fullName: userInfo?.name || "",
    phone: userInfo?.phone || "",
    address: "",
    city: "",
    pincode: "",
  });

  const getCart = async () => {
    if (!userInfo?._id) {
      setLoading(false);
      return;
    }
    try {
      const res = await api.get(`/api/cart/${userInfo._id}`);
      setCart(res.data);
    } catch (error) {
      console.error("Error fetching cart for checkout:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo?._id) {
      getCart();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };

  const handleApplyCoupon = async (e) => {
    e?.preventDefault();
    const code = couponInput.trim().toUpperCase();
    if (!code) {
      setCouponError("Please enter a coupon code");
      return;
    }

    setCouponLoading(true);
    setCouponError("");
    setCouponSuccessMsg("");

    try {
      const cartTotal = cart?.totalPrice || 0;
      const res = await api.post("/api/coupons/validate", {
        code,
        cartTotal,
      });

      if (res.data?.valid) {
        setAppliedCoupon(res.data);
        setCouponSuccessMsg(`Coupon '${res.data.code}' applied! You saved ₹${res.data.discount.toLocaleString()}`);
        setCouponInput(res.data.code);
      } else {
        setCouponError(res.data?.message || "Invalid coupon");
        setAppliedCoupon(null);
      }
    } catch (err) {
      setCouponError(err.response?.data?.message || "Failed to validate coupon");
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError("");
    setCouponSuccessMsg("");
  };

  const placeOrder = async () => {
    if (!address.fullName || !address.phone || !address.address) {
      alert("Please fill in required shipping address fields (Full Name, Phone, Address)");
      return;
    }

    const validItems = (cart?.items || []).filter((item) => item && item.product);

    if (validItems.length === 0) {
      alert("Your cart is empty or products are no longer available.");
      return;
    }

    setSubmitting(true);
    try {
      const subtotal = cart?.totalPrice || 0;
      const discount = appliedCoupon ? appliedCoupon.discount : 0;
      const finalPrice = Math.max(0, subtotal - discount);

      await api.post("/api/orders/add", {
        user: userInfo._id,
        items: validItems.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price || item.price,
        })),
        shippingAddress: address,
        paymentMethod: "COD",
        totalPrice: finalPrice,
        couponCode: appliedCoupon?.code || "",
        couponDiscount: discount,
      });

      alert("Order placed successfully!");
      navigate("/orders");
    } catch (error) {
      console.error("Order placement error:", error);
      alert(error.response?.data?.message || "Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  const validCartItems = (cart?.items || []).filter((item) => item && item.product);
  const subtotal = cart?.totalPrice || 0;
  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const finalPayable = Math.max(0, subtotal - discountAmount);

  return (
    <div className="space-y-8 pb-12">
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

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={address.fullName}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3.5 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Phone Number</label>
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={address.phone}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3.5 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Delivery Address</label>
            <textarea
              name="address"
              placeholder="House/Street/Flat No, Area..."
              rows="3"
              value={address.address}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3.5 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">City</label>
              <input
                type="text"
                name="city"
                placeholder="City"
                value={address.city}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3.5 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Pincode</label>
              <input
                type="text"
                name="pincode"
                placeholder="Pincode"
                value={address.pincode}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3.5 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Order Summary & Payment */}
        <div className="bg-slate-800/90 p-6 sm:p-8 rounded-3xl border border-slate-700/60 shadow-xl flex flex-col justify-between backdrop-blur-md space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white font-['Outfit'] border-b border-slate-700/60 pb-3 flex items-center gap-2">
              <Truck className="w-5 h-5 text-purple-400" />
              <span>Order Summary</span>
            </h2>

            <div className="space-y-3 mt-4 text-sm max-h-52 overflow-y-auto pr-1">
              {validCartItems.map((item) => (
                <div
                  key={item.product._id}
                  className="flex justify-between items-center bg-slate-900/80 p-3 rounded-xl border border-slate-700/50"
                >
                  <span className="font-medium text-white text-xs sm:text-sm line-clamp-1 flex-1 pr-2">
                    {item.product.name} × {item.quantity}
                  </span>

                  <span className="font-bold text-blue-400 text-sm">
                    ₹{((item.product.price || item.price) * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Coupon Code Section */}
            <div className="mt-6 pt-4 border-t border-slate-700/60">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <Tag className="w-3.5 h-3.5 text-purple-400" />
                <span>Apply Coupon</span>
              </label>

              {!appliedCoupon ? (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="ENTER COUPON CODE"
                    value={couponInput}
                    onChange={(e) => {
                      setCouponInput(e.target.value.toUpperCase());
                      setCouponError("");
                    }}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono text-sm uppercase placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                  <button
                    type="submit"
                    disabled={couponLoading || !couponInput.trim()}
                    className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-md shadow-purple-600/20"
                  >
                    {couponLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Apply</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <Tag className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white text-sm tracking-wider">{appliedCoupon.code}</span>
                        <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Applied
                        </span>
                      </div>
                      <p className="text-xs text-emerald-400 font-medium">
                        Discount: -₹{appliedCoupon.discount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    type="button"
                    className="p-1.5 hover:bg-slate-700/60 rounded-lg text-slate-400 hover:text-white transition"
                    title="Remove Coupon"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {couponError && (
                <p className="mt-2 text-xs text-rose-400 font-medium flex items-center gap-1">
                  <span>⚠️</span> {couponError}
                </p>
              )}
              {couponSuccessMsg && !couponError && (
                <p className="mt-2 text-xs text-emerald-400 font-medium">
                  {couponSuccessMsg}
                </p>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="pt-4 border-t border-slate-700/60 mt-4 space-y-2">
              <div className="flex justify-between text-slate-400 text-sm">
                <span>Subtotal</span>
                <span className="text-white font-medium">₹{subtotal.toLocaleString()}</span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-emerald-400 text-sm">
                  <span>Coupon Discount ({appliedCoupon.code})</span>
                  <span className="font-bold">-₹{discountAmount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-300 text-sm">
                <span>Payment Method</span>
                <span className="text-purple-300 font-semibold">Cash On Delivery (COD)</span>
              </div>

              <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-slate-700/40">
                <span>Total Amount</span>
                <span className="text-xl text-blue-400 font-['Outfit']">₹{finalPayable.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <button
            onClick={placeOrder}
            disabled={submitting}
            className="w-full btn-primary-gradient py-4 rounded-xl font-semibold text-white text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 disabled:opacity-50"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>{submitting ? "Placing Order..." : `Confirm Order (₹${finalPayable.toLocaleString()})`}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;