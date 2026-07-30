import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ShoppingBag, User, Mail, Phone, Lock, UserPlus, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { API_URL } from "../services/api";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match. Please re-enter.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${API_URL}/api/auth/register`,
        formData
      );


      console.log(res.data);
      setSuccessMessage("Account created successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.log(error.response?.data || error.message);
      setErrorMessage(
        error.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Ambient Glow Circles */}
      <div className="absolute top-10 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl w-full rounded-3xl border border-purple-900/40 bg-[#0f172a]/90 backdrop-blur-2xl shadow-2xl overflow-hidden grid md:grid-cols-2 relative z-10">

        {/* Left Banner */}
        <div className="p-8 sm:p-12 bg-gradient-to-br from-purple-900/60 via-blue-900/60 to-slate-950 flex flex-col justify-between border-b md:border-b-0 md:border-r border-purple-900/30">
          <div>
            <Link to="/" className="flex items-center gap-2.5 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center text-white shadow-lg">
                <ShoppingBag className="w-5.5 h-5.5" />
              </div>
              <span className="text-2xl font-extrabold font-['Outfit'] text-white">
                Flip<span className="text-purple-400">Shop</span>
              </span>
            </Link>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-4 border border-blue-500/30">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Join FlipShop VIP
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-['Outfit'] leading-tight mb-4">
              Create Your Free Account Today
            </h1>

            <p className="text-slate-300 text-sm leading-relaxed">
              Unlock exclusive discounts, track shipments in real-time, save your wishlist, and enjoy standard premium perks.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-purple-800/30 flex items-center gap-3 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Verified & Encrypted User Registration</span>
          </div>
        </div>

        {/* Right Form */}
        <div className="p-8 sm:p-12 flex flex-col justify-center">

          {errorMessage && (
            <div className="mb-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-900 border border-purple-500/30 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition-all"
                  required
                />
                <User className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-900 border border-purple-500/30 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition-all"
                  required
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <div className="relative">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-900 border border-purple-500/30 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition-all"
                  required
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-900 border border-purple-500/30 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition-all"
                  required
                />
                <Lock className="w-4.5 h-4.5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <div className="relative">
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-900 border border-purple-500/30 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition-all"
                  required
                />
                <Lock className="w-4.5 h-4.5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary-gradient py-3 rounded-xl font-semibold text-white text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 hover:shadow-blue-500/40 transition-all disabled:opacity-50 mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Create Account</span>
                  <UserPlus className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-400">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-400 hover:text-purple-300 font-semibold inline-flex items-center gap-1">
              Sign In <ArrowRight className="w-3 h-3" />
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
};

export default Register;