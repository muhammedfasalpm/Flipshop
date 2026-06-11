import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(formData);

    const res = await axios.post("http://localhost:4000/api/auth/login", {
      formData
    });

        if (res.data.success) {
          alert("Login Successful");
        } else {
          alert("Login Failed");
        }
  };
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-5">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl w-full grid md:grid-cols-2">
        {/* Left Side */}
        <div className="bg-blue-600 text-white p-10 flex flex-col justify-center">
          <h1 className="text-4xl font-bold">Login</h1>

          <p className="mt-4">
            Get access to your Orders, Wishlist and Recommendations.
          </p>
        </div>

        {/* Right Side */}
        <div className="p-10">
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border-b p-3 outline-none mb-6"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border-b p-3 outline-none mb-6"
              required
            />

            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-3 rounded hover:bg-orange-600"
            >
              Login
            </button>
          </form>

          <button className="w-full mt-4 border py-3 rounded hover:bg-gray-100">
            Login with Google
          </button>

          <p className="mt-6 text-center">
            New User?{" "}
            <Link to="/register" className="text-blue-600 font-semibold">
              Create an Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
