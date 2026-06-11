import React, { useState } from "react";

const Profile = () => {
  const [user, setUser] = useState({
    name: "Fasal PK",
    email: "fasal@gmail.com",
    phone: "9876543210",
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const saveProfile = () => {
    setIsEditing(false);
    alert("Profile Updated Successfully");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-3xl font-bold mb-6">
          My Profile
        </h1>

        <div className="bg-white rounded-lg shadow p-6">

          {/* Profile Image */}
          <div className="flex justify-center mb-6">
            <img
              src="https://via.placeholder.com/150"
              alt="profile"
              className="w-32 h-32 rounded-full border-4 border-blue-500"
            />
          </div>

          {/* User Details */}
          <div className="space-y-4">

            <div>
              <label className="font-semibold block mb-1">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={user.name}
                disabled={!isEditing}
                onChange={handleChange}
                className="w-full border rounded p-3"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={user.email}
                disabled={!isEditing}
                onChange={handleChange}
                className="w-full border rounded p-3"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">
                Phone Number
              </label>

              <input
                type="text"
                name="phone"
                value={user.phone}
                disabled={!isEditing}
                onChange={handleChange}
                className="w-full border rounded p-3"
              />
            </div>

          </div>

          {/* Buttons */}
          <div className="mt-6 flex gap-3">

            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded"
              >
                Edit Profile
              </button>
            ) : (
              <button
                onClick={saveProfile}
                className="bg-green-600 text-white px-6 py-2 rounded"
              >
                Save Changes
              </button>
            )}

          </div>

        </div>

        {/* Address Section */}
        <div className="bg-white rounded-lg shadow p-6 mt-6">

          <h2 className="text-2xl font-bold mb-4">
            Saved Address
          </h2>

          <div className="border rounded p-4">
            <p className="font-semibold">
              Fasal PK
            </p>

            <p>
              ABC House, Kerala,
              India - 680001
            </p>

            <p>Phone: 9876543210</p>
          </div>

          <button className="mt-4 bg-orange-500 text-white px-5 py-2 rounded">
            Add New Address
          </button>

        </div>

      </div>
    </div>
  );
};

export default Profile;