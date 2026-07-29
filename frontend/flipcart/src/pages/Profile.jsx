
import React, { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const userInfo = JSON.parse(
    localStorage.getItem("userInfo")
  );

  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);

  const [image, setImage] = useState(null);

  const [preview, setPreview] = useState("");

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    house: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  useEffect(() => {
    if (userInfo?._id) {
      getProfile();
    }
  }, []);

  const getProfile = async () => {
    try {
      const res = await axios.get(
        `http://localhost:4000/api/users/profile/${userInfo._id}`
      );

      const data = res.data;

      setUser({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        house:
          data.addresses?.[0]?.house || "",
        city:
          data.addresses?.[0]?.city || "",
        state:
          data.addresses?.[0]?.state || "",
        pincode:
          data.addresses?.[0]?.pincode ||
          "",
        country:
          data.addresses?.[0]?.country ||
          "India",
      });

      if (data.image) {
        setPreview(
          `http://localhost:4000/${data.image}`
        );
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setUser((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.value,
    }));
  };

  const handleImage = (e) => {
    setImage(e.target.files[0]);

    setPreview(
      URL.createObjectURL(
        e.target.files[0]
      )
    );
  };

  const saveProfile = async () => {
    try {
      const formData = new FormData();

      formData.append(
        "name",
        user.name
      );

      formData.append(
        "email",
        user.email
      );

      formData.append(
        "phone",
        user.phone
      );

      formData.append(
        "house",
        user.house
      );

      formData.append(
        "city",
        user.city
      );

      formData.append(
        "state",
        user.state
      );

      formData.append(
        "pincode",
        user.pincode
      );

      formData.append(
        "country",
        user.country
      );

      if (image) {
        formData.append(
          "image",
          image
        );
      }

      const res = await axios.put(
        `http://localhost:4000/api/users/profile/${userInfo._id}`,
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      localStorage.setItem(
        "userInfo",
        JSON.stringify({
          ...userInfo,
          name: res.data.user.name,
          email: res.data.user.email,
          phone: res.data.user.phone,
          image: res.data.user.image,
        })
      );

      alert(
        "Profile Updated Successfully"
      );

      setIsEditing(false);

      getProfile();
    } catch (error) {
      console.log(error);

      alert(
        "Failed to update profile"
      );
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-2xl">
        Loading...
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-3xl font-bold mb-6">
          My Profile
        </h1>

        <div className="bg-white rounded-lg shadow p-6">

          {/* Profile Image */}
          <div className="flex flex-col items-center mb-8">

            <img
              src={
                preview
                  ? preview
                  : "https://via.placeholder.com/150"
              }
              alt="Profile"
              className="w-36 h-36 rounded-full border-4 border-blue-500 object-cover"
            />

            {isEditing && (
              <input
                type="file"
                accept="image/*"
                onChange={handleImage}
                className="mt-4"
              />
            )}

          </div>

          {/* User Details */}
          <div className="grid md:grid-cols-2 gap-5">

            <div>
              <label className="font-semibold">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={user.name}
                disabled={!isEditing}
                onChange={handleChange}
                className="w-full border rounded p-3 mt-1"
              />
            </div>

            <div>
              <label className="font-semibold">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={user.email}
                disabled={!isEditing}
                onChange={handleChange}
                className="w-full border rounded p-3 mt-1"
              />
            </div>

            <div>
              <label className="font-semibold">
                Phone
              </label>

              <input
                type="text"
                name="phone"
                value={user.phone}
                disabled={!isEditing}
                onChange={handleChange}
                className="w-full border rounded p-3 mt-1"
              />
            </div>

            <div>
              <label className="font-semibold">
                House
              </label>

              <input
                type="text"
                name="house"
                value={user.house}
                disabled={!isEditing}
                onChange={handleChange}
                className="w-full border rounded p-3 mt-1"
              />
            </div>

            <div>
              <label className="font-semibold">
                City
              </label>

              <input
                type="text"
                name="city"
                value={user.city}
                disabled={!isEditing}
                onChange={handleChange}
                className="w-full border rounded p-3 mt-1"
              />
            </div>

            <div>
              <label className="font-semibold">
                State
              </label>

              <input
                type="text"
                name="state"
                value={user.state}
                disabled={!isEditing}
                onChange={handleChange}
                className="w-full border rounded p-3 mt-1"
              />
            </div>

            <div>
              <label className="font-semibold">
                Pincode
              </label>

              <input
                type="text"
                name="pincode"
                value={user.pincode}
                disabled={!isEditing}
                onChange={handleChange}
                className="w-full border rounded p-3 mt-1"
              />
            </div>

            <div>
              <label className="font-semibold">
                Country
              </label>

              <input
                type="text"
                name="country"
                value={user.country}
                disabled={!isEditing}
                onChange={handleChange}
                className="w-full border rounded p-3 mt-1"
              />
            </div>

          </div>

          {/* Buttons */}
          <div className="mt-8 flex gap-4">

            {!isEditing ? (
              <button
                onClick={() =>
                  setIsEditing(true)
                }
                className="bg-blue-600 text-white px-8 py-3 rounded"
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={saveProfile}
                  className="bg-green-600 text-white px-8 py-3 rounded"
                >
                  Save Changes
                </button>

                <button
                  onClick={() => {
                    setIsEditing(false);
                    getProfile();
                  }}
                  className="bg-gray-500 text-white px-8 py-3 rounded"
                >
                  Cancel
                </button>
              </>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

export default Profile;

