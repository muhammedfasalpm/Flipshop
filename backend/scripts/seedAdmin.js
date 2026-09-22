import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";
import User from "../models/User.js";

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const seedAdmin = async () => {
  const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/flipshop";

  try {
    console.log("Connecting to MongoDB for Admin Account Setup...");
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB successfully.");

    const adminName = process.env.ADMIN_NAME || "FlipShop Admin";
    const adminEmail = (process.env.ADMIN_EMAIL || "admin@flipshop.com").toLowerCase().trim();
    const adminPhone = (process.env.ADMIN_PHONE || "9876543210").trim();
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123456";

    // Check if an admin or user with this email or phone already exists
    let existingAdmin = await User.findOne({
      $or: [{ email: adminEmail }, { phone: adminPhone }],
    });

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    if (existingAdmin) {
      console.log(`Found existing account: ${existingAdmin.email} / ${existingAdmin.phone}`);
      existingAdmin.name = adminName;
      existingAdmin.email = adminEmail;
      existingAdmin.phone = adminPhone;
      existingAdmin.password = hashedPassword;
      existingAdmin.role = "admin";
      existingAdmin.isBlocked = false;
      await existingAdmin.save();
      console.log("✅ Admin account updated successfully with role='admin'.");
    } else {
      console.log("Creating new Admin account...");
      const newAdmin = await User.create({
        name: adminName,
        email: adminEmail,
        phone: adminPhone,
        password: hashedPassword,
        role: "admin",
      });
      console.log(`✅ Admin account created successfully! ID: ${newAdmin._id}`);
    }

    console.log("-----------------------------------------");
    console.log("ADMIN ACCOUNT DETAILS FOR LOGIN:");
    console.log(`Email: ${adminEmail}`);
    console.log(`Mobile: ${adminPhone}`);
    console.log("Role: admin");
    console.log("-----------------------------------------");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error setting up Admin account:", error.message);
    process.exit(1);
  }
};

seedAdmin();
