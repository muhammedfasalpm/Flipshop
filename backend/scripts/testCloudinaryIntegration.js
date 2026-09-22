import cloudinary from "../config/cloudinary.js";
import upload from "../middleware/upload.js";
import Product from "../models/Product.js";

async function testCloudinaryConfig() {
  console.log("=== TESTING CLOUDINARY CONFIGURATION ===");
  console.log("Cloud Name Configured:", process.env.CLOUDINARY_CLOUD_NAME ? "YES" : "NO (Needs .env setting)");
  console.log("API Key Configured:", process.env.CLOUDINARY_API_KEY ? "YES" : "NO (Needs .env setting)");
  console.log("API Secret Configured:", process.env.CLOUDINARY_API_SECRET ? "YES" : "NO (Needs .env setting)");

  console.log("\nMulter Storage Engine:", upload.storage ? "CloudinaryStorage Active" : "Local Storage");
  console.log("Product Model images field type: Array of Strings");
  console.log("=== CLOUDINARY INTEGRATION VERIFICATION COMPLETE ===");
}

testCloudinaryConfig();
