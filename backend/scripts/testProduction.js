import https from "https";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import User from "../models/User.js";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const postRequest = (urlStr, data) => {
  return new Promise((resolve, reject) => {
    const url = new URL(urlStr);
    const body = JSON.stringify(data);

    const req = https.request(
      url,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body),
        },
      },
      (res) => {
        let resData = "";
        res.on("data", (chunk) => (resData += chunk));
        res.on("end", () => {
          try {
            resolve({ statusCode: res.statusCode, data: JSON.parse(resData) });
          } catch (e) {
            resolve({ statusCode: res.statusCode, raw: resData });
          }
        });
      }
    );

    req.on("error", reject);
    req.write(body);
    req.end();
  });
};

const runDiagnostics = async () => {
  console.log("=========================================");
  console.log("PRODUCTION END-TO-END DIAGNOSTIC");
  console.log("=========================================");

  // 1. Check MongoDB Atlas Connection & User Count
  const mongoUri = process.env.MONGO_URI;
  console.log(`1. MONGO_URI Configured Host: ${mongoUri ? mongoUri.replace(/\/\/(.*):(.*)@/, "//***:***@") : "MISSING"}`);

  if (mongoUri) {
    try {
      await mongoose.connect(mongoUri);
      console.log(`2. Database Host: ${mongoose.connection.host}`);
      console.log(`3. Database Name: ${mongoose.connection.name}`);

      const userCount = await User.countDocuments({});
      console.log(`4. Atlas Total User Count: ${userCount}`);

      const adminUser = await User.findOne({ role: "admin" }).select("-password");
      console.log("5. Atlas Admin User Document:", JSON.stringify(adminUser, null, 2));

      await mongoose.disconnect();
    } catch (dbErr) {
      console.error("❌ MongoDB Atlas Connection Error:", dbErr.message);
    }
  }

  // 6. Test Live Production Backend URL Login
  console.log("\n6. Testing Live Production Backend API Endpoint:");
  console.log("   Endpoint: https://flipshop-mjz2.onrender.com/api/auth/login");

  const emailToTest = process.env.ADMIN_EMAIL || "fasal@gmail.com";
  const phoneToTest = process.env.ADMIN_PHONE || "8129691138";
  const passToTest = process.env.ADMIN_PASSWORD || "fasal1307";

  console.log(`   Testing Login with Email: ${emailToTest}`);
  try {
    const liveEmailRes = await postRequest("https://flipshop-mjz2.onrender.com/api/auth/login", {
      identifier: emailToTest,
      password: passToTest,
    });
    console.log("   Live Backend HTTP Status (Email):", liveEmailRes.statusCode);
    console.log("   Live Backend Response Body (Email):", JSON.stringify(liveEmailRes.data || liveEmailRes.raw, null, 2));
  } catch (err) {
    console.error("   ❌ Error connecting to Live Render Backend:", err.message);
  }

  console.log(`\n   Testing Login with Mobile Phone: ${phoneToTest}`);
  try {
    const livePhoneRes = await postRequest("https://flipshop-mjz2.onrender.com/api/auth/login", {
      identifier: phoneToTest,
      password: passToTest,
    });
    console.log("   Live Backend HTTP Status (Phone):", livePhoneRes.statusCode);
    console.log("   Live Backend Response Body (Phone):", JSON.stringify(livePhoneRes.data || livePhoneRes.raw, null, 2));
  } catch (err) {
    console.error("   ❌ Error connecting to Live Render Backend:", err.message);
  }

  console.log("=========================================");
};

runDiagnostics();
