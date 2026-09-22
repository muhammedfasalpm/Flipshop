import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";
import User from "../models/User.js";

// Load environment variables from .env if present
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const createAdmin = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error("❌ Error: MONGO_URI environment variable is not defined.");
    console.error("Please set MONGO_URI in your environment or .env file before running this script.");
    process.exit(1);
  }

  const adminName = process.env.ADMIN_NAME || "FlipShop Admin";
  const adminEmail = (process.env.ADMIN_EMAIL || "admin@flipshop.com").toLowerCase().trim();
  const adminPhone = (process.env.ADMIN_PHONE || "9876543210").trim();
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123456";

  try {
    console.log("Connecting to MongoDB Atlas database...");
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB successfully.");

    // Look for an existing account matching the admin email or phone number
    let existingUser = await User.findOne({
      $or: [{ email: adminEmail }, { phone: adminPhone }],
    });

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    if (existingUser) {
      console.log(`User matching email (${adminEmail}) or phone (${adminPhone}) already exists.`);
      existingUser.name = adminName;
      existingUser.email = adminEmail;
      existingUser.phone = adminPhone;
      existingUser.password = hashedPassword;
      existingUser.role = "admin";
      existingUser.isBlocked = false;
      await existingUser.save();
      console.log("✅ Existing user successfully updated to Admin role.");
    } else {
      console.log("Creating new Admin user in MongoDB Atlas...");
      const newAdmin = await User.create({
        name: adminName,
        email: adminEmail,
        phone: adminPhone,
        password: hashedPassword,
        role: "admin",
      });
      console.log(`✅ Admin user created successfully with ID: ${newAdmin._id}`);
    }

    console.log("=========================================");
    console.log("ADMIN CREATION COMPLETE");
    console.log(`Name:     ${adminName}`);
    console.log(`Email:    ${adminEmail}`);
    console.log(`Phone:    ${adminPhone}`);
    console.log(`Role:     admin`);
    console.log("=========================================");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to create/update Admin user:", error.message);
    process.exit(1);
  }
};

createAdmin();
