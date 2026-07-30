import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ShoppingBag, Mail, Lock, LogIn, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { API_URL } from "../services/api";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await axios.post(
        `${API_URL}/api/auth/login`,
        formData
      );


      if (res.data.success) {
        localStorage.setItem("userInfo", JSON.stringify(res.data));
        if (res.data.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      console.log(error.response?.data);
      setErrorMessage(
        error.response?.data?.message || "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Ambient Glow Circles */}
      <div className="absolute top-10 left-1/3 w-96 h-96 bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/3 w-96 h-96 bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl w-full rounded-3xl border border-purple-900/40 bg-[#0f172a]/90 backdrop-blur-2xl shadow-2xl overflow-hidden grid md:grid-cols-2 relative z-10">

        {/* Left Banner */}
        <div className="p-8 sm:p-12 bg-gradient-to-br from-blue-900/60 via-purple-900/60 to-slate-950 flex flex-col justify-between border-b md:border-b-0 md:border-r border-purple-900/30">
          <div>
            <Link to="/" className="flex items-center gap-2.5 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-lg">
                <ShoppingBag className="w-5.5 h-5.5" />
              </div>
              <span className="text-2xl font-extrabold font-['Outfit'] text-white">
                Flip<span className="text-purple-400">Shop</span>
              </span>
            </Link>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-4 border border-purple-500/30">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Welcome Back
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-['Outfit'] leading-tight mb-4">
              Sign In to Your Account
            </h1>

            <p className="text-slate-300 text-sm leading-relaxed">
              Access your personalized dashboard, saved items, past orders, and instant exclusive checkout deals.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-purple-800/30 flex items-center gap-3 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>End-to-End SSL 256-bit Encrypted Session</span>
          </div>
        </div>

        {/* Right Form */}
        <div className="p-8 sm:p-12 flex flex-col justify-center">

          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900 border border-purple-500/30 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  required
                />
                <Mail className="w-4.5 h-4.5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900 border border-purple-500/30 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  required
                />
                <Lock className="w-4.5 h-4.5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary-gradient py-3.5 rounded-xl font-semibold text-white text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 hover:shadow-blue-500/40 transition-all disabled:opacity-50 mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <LogIn className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-slate-400">
            Don't have an account yet?{" "}
            <Link to="/register" className="text-blue-400 hover:text-purple-300 font-semibold inline-flex items-center gap-1">
              Create Free Account <ArrowRight className="w-3 h-3" />
            </Link>
          </p>

        </div>

      </div>
    </div>
  );
};

export default Login;