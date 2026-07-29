import User from "../models/User.js";

// ======================
// Get All Users (Admin)
// ======================
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ======================
// Get User Profile
// ======================
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ======================
// Update Profile
// ======================
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.name = req.body.name;
    user.email = req.body.email;
    user.phone = req.body.phone;

    // Profile Image
    if (req.file) {
      user.image = req.file.path;
    }

    // Address
    if (req.body.house) {
      user.addresses = [
        {
          fullName: req.body.name,
          phone: req.body.phone,
          house: req.body.house,
          city: req.body.city,
          state: req.body.state,
          pincode: req.body.pincode,
          country: req.body.country || "India",
        },
      ];
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ======================
// Delete User
// ======================
export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ======================
// Block / Unblock User
// ======================
export const blockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.isBlocked = !user.isBlocked;

    await user.save();

    res.status(200).json({
      success: true,
      message: user.isBlocked
        ? "User blocked"
        : "User unblocked",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};