import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// Register
export const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
    } = req.body;

    const userExists = await User.findOne({
      email,
    });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
    });

  res.status(201).json({
  success: true,
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  image: user.image,
  role: user.role,
  token: generateToken(
    user._id,
    user.email
  ),
});

 
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email,
    });

    if (
      user &&
      (await bcrypt.compare(
        password,
        user.password
      ))
    ) {
    
      res.status(200).json({
  success: true,
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  image: user.image,
  role: user.role,
  token: generateToken(
    user._id,
    user.email
  ),
});

    } else {
      res.status(401).json({
        success: false,
        message:
          "Invalid Email or Password",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};