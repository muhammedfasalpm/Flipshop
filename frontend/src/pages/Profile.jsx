import { useEffect, useState } from "react";
import { User, Edit3, Save, X, Camera } from "lucide-react";
import api, { getImageUrl } from "../services/api";

const Profile = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");

  const [loading, setLoading] = useState(Boolean(userInfo?._id));
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

  const getProfile = async () => {
    if (!userInfo?._id) return;
    try {
      const res = await api.get(`/api/users/profile/${userInfo._id}`);
      const data = res.data;

      setUser({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        house: data.addresses?.[0]?.house || "",
        city: data.addresses?.[0]?.city || "",
        state: data.addresses?.[0]?.state || "",
        pincode: data.addresses?.[0]?.pincode || "",
        country: data.addresses?.[0]?.country || "India",
      });

      if (data.image) {
        setPreview(getImageUrl(data.image));
      }

      setLoading(false);
    } catch (error) {
      console.error("Profile fetch error:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo?._id) {
      getProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    setUser((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImage = (e) => {
    if (e.target.files?.[0]) {
      setImage(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const saveProfile = async () => {
    try {
      const formData = new FormData();
      formData.append("name", user.name);
      formData.append("email", user.email);
      formData.append("phone", user.phone);
      formData.append("house", user.house);
      formData.append("city", user.city);
      formData.append("state", user.state);
      formData.append("pincode", user.pincode);
      formData.append("country", user.country);

      if (image) {
        formData.append("image", image);
      }

      const res = await api.put(`/api/users/profile/${userInfo._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const updatedUser = res.data.user || res.data;
      localStorage.setItem(
        "userInfo",
        JSON.stringify({
          ...userInfo,
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
          image: updatedUser.image,
        })
      );

      alert("Profile Updated Successfully!");
      setIsEditing(false);
      getProfile();
    } catch (error) {
      console.error("Save profile error:", error);
      alert(error.response?.data?.message || "Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-800/80 border border-slate-700/60 backdrop-blur-md flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit'] flex items-center gap-3">
          <User className="w-7 h-7 text-purple-400" />
          <span>User Profile</span>
        </h1>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="btn-primary-gradient px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-purple-600/20"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={saveProfile}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                getProfile();
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
          </div>
        )}
      </div>

      <div className="bg-slate-800/90 rounded-3xl border border-slate-700/60 p-6 sm:p-8 space-y-8 backdrop-blur-md shadow-xl">
        {/* Profile Avatar */}
        <div className="flex flex-col items-center">
          <div className="relative group">
            <img
              src={preview || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop"}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-purple-500/40 object-cover bg-slate-900 shadow-xl"
            />
            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-purple-600 text-white p-2.5 rounded-full cursor-pointer shadow-lg hover:bg-purple-500 transition-colors">
                <Camera className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                  className="hidden"
                />
              </label>
            )}
          </div>
          <h2 className="text-xl font-bold text-white font-['Outfit'] mt-3">{user.name || "User"}</h2>
          <p className="text-xs text-slate-400">{user.email}</p>
        </div>

        {/* User Details Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={user.name}
              disabled={!isEditing}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white disabled:opacity-60 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={user.email}
              disabled={!isEditing}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white disabled:opacity-60 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Phone Number
            </label>
            <input
              type="text"
              name="phone"
              value={user.phone}
              disabled={!isEditing}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white disabled:opacity-60 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              House / Building
            </label>
            <input
              type="text"
              name="house"
              value={user.house}
              disabled={!isEditing}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white disabled:opacity-60 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              City
            </label>
            <input
              type="text"
              name="city"
              value={user.city}
              disabled={!isEditing}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white disabled:opacity-60 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              State
            </label>
            <input
              type="text"
              name="state"
              value={user.state}
              disabled={!isEditing}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white disabled:opacity-60 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Pincode
            </label>
            <input
              type="text"
              name="pincode"
              value={user.pincode}
              disabled={!isEditing}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white disabled:opacity-60 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Country
            </label>
            <input
              type="text"
              name="country"
              value={user.country}
              disabled={!isEditing}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white disabled:opacity-60 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
