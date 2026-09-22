import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import User from "../models/User.js";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const verifyDb = async () => {
  const mongoUri = process.env.MONGO_URI || "";

  // Sanitize URI for display (remove password/username)
  const sanitizedUri = mongoUri.replace(/\/\/(.*):(.*)@/, "//***:***@");

  console.log("=========================================");
  console.log("DATABASE VERIFICATION DIAGNOSTIC");
  console.log("=========================================");
  console.log(`Configured MONGO_URI: ${sanitizedUri}`);

  if (!mongoUri) {
    console.error("❌ MONGO_URI is missing from process.env!");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    const connHost = mongoose.connection.host;
    const connDbName = mongoose.connection.name;

    console.log(`1. Active Connection Host:     ${connHost}`);
    console.log(`2. Active Connection Database: ${connDbName}`);

    const totalCount = await User.countDocuments({});
    console.log(`3. Total User Count:           ${totalCount}`);

    const adminUsers = await User.find({ role: "admin" }).select("-password");
    console.log("4. Found Admin Users:");
    console.log(JSON.stringify(adminUsers, null, 2));

    const targetIdExists = await User.findById("6aacfada3041cf2c66ba5178");
    console.log(`5. ID '6aacfada3041cf2c66ba5178' exists: ${Boolean(targetIdExists)}`);

    const isAtlasTarget = connHost.includes("rkt0m44.mongodb.net") || connHost.includes("cluster0");
    const isFlipshopDb = connDbName === "flipshop";

    console.log(`6. Connected to cluster0.rkt0m44.mongodb.net: ${isAtlasTarget}`);
    console.log(`   Connected to 'flipshop' database:         ${isFlipshopDb}`);

    if (!isAtlasTarget) {
      console.log("\n⚠️ WARNING: Currently connected to LOCAL or OTHER database, NOT MongoDB Atlas cluster0.rkt0m44.mongodb.net!");
    } else {
      console.log("\n✅ SUCCESS: Connected directly to MongoDB Atlas cluster0.rkt0m44.mongodb.net!");
    }
    console.log("=========================================");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during verification:", error.message);
    process.exit(1);
  }
};

verifyDb();
