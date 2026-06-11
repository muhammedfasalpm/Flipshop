import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
const Register = () => {
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

  if (formData.password !== formData.confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  try {
    const res = await axios.post(
      "http://localhost:4000/api/auth/register",
      formData
      
    );

    console.log(res.data);
    alert("Registration Successful");
  } catch (error) {
    console.log(error.response?.data || error.message);
    alert(error.response?.data?.message || "Registration Failed");
  }
};

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-5">

      <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-5xl w-full grid md:grid-cols-2">

        {/* Left Side */}
        <div className="bg-blue-600 text-white p-10 flex flex-col justify-center">

          <h1 className="text-4xl font-bold">
            Looks like you're new here!
          </h1>

          <p className="mt-4">
            Sign up to get access to your orders,
            wishlist and personalized recommendations.
          </p>

        </div>

        {/* Right Side */}
        <div className="p-10">

          <form onSubmit={handleSubmit} className="space-y-5">

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border p-3 rounded"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full border p-3 rounded"
              required
            />

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border p-3 rounded"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border p-3 rounded"
              required
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full border p-3 rounded"
              required
            />

            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-3 rounded hover:bg-orange-600"
            >
              Register
            </button>

          </form>

          <button className="w-full mt-4 border py-3 rounded hover:bg-gray-100">
            Continue with Google
          </button>

          <p className="mt-6 text-center">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-semibold"
            >
              Login
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
};

export default Register;