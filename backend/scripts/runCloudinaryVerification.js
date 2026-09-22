import cloudinary from "../config/cloudinary.js";

const API_URL = "http://localhost:5000";

async function runVerification() {
  console.log("=== CLOUDINARY & PRODUCT ADD VERIFICATION ===");

  // 1. Env check (SET / NOT SET only)
  console.log("CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME ? "SET" : "NOT SET");
  console.log("CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY ? "SET" : "NOT SET");
  console.log("CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET ? "SET" : "NOT SET");

  // 2. Minimal direct Cloudinary upload test
  console.log("\n--- 1. Minimal Authenticated Cloudinary Upload Test ---");
  let samplePublicId = null;
  try {
    const testImageBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
    const directUploadRes = await cloudinary.uploader.upload(testImageBase64, {
      folder: "flipshop/products",
      tags: ["test_upload"]
    });
    samplePublicId = directUploadRes.public_id;
    console.log("Direct Upload Test: PASS");
    console.log("Uploaded Folder/Public ID:", directUploadRes.public_id);
    console.log("Secure URL Host:", new URL(directUploadRes.secure_url).hostname);

    // Clean up direct upload test image
    if (samplePublicId) {
      await cloudinary.uploader.destroy(samplePublicId);
      console.log("Direct Upload Test Asset Cleanup: DONE");
    }
  } catch (err) {
    console.error("Direct Upload Test: FAIL ->", err.message);
    process.exit(1);
  }

  // 3. Authenticated POST /api/products/add test
  console.log("\n--- 2. POST /api/products/add Test ---");
  let adminToken = "";
  try {
    const loginRes = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "fasal@gmail.com",
        password: "fasal1307",
      }),
    });
    const loginData = await loginRes.json();
    adminToken = loginData.token;
    console.log("Admin Login: SUCCESS (Token Received)");
  } catch (err) {
    console.error("Admin Login Failed:", err.message);
    process.exit(1);
  }

  const base64Png = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
  const buffer = Buffer.from(base64Png, "base64");
  const blob = new Blob([buffer], { type: "image/png" });

  const formData = new FormData();
  formData.append("name", "Verification Test Product");
  formData.append("description", "Temporary product for Cloudinary integration testing.");
  formData.append("category", "Electronics");
  formData.append("brand", "TestBrand");
  formData.append("price", "999");
  formData.append("stock", "10");
  formData.append("images", blob, "test_item.png");

  try {
    const addRes = await fetch(`${API_URL}/api/products/add`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
      body: formData,
    });
    const addData = await addRes.json();
    console.log("POST /api/products/add HTTP Status:", addRes.status);
    
    if (addRes.status === 201 && addData.product) {
      const imageUrl = addData.product.images[0];
      console.log("Product Created ID:", addData.product._id);
      console.log("Product.images contains HTTPS Cloudinary URL:", imageUrl.startsWith("https://res.cloudinary.com"));
      console.log("Product.images contains flipshop/products folder path:", imageUrl.includes("flipshop/products") || imageUrl.includes("flipshop"));

      // 4. Cleanup test product from database (and Cloudinary via delete controller if configured)
      const delRes = await fetch(`${API_URL}/api/products/delete/${addData.product._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
      const delData = await delRes.json();
      console.log("Cleaned up test product from DB:", delRes.status === 200 ? "SUCCESS" : "FAILED", delData.message);
    } else {
      console.error("Product Add Failed:", addData);
      process.exit(1);
    }
  } catch (err) {
    console.error("POST /api/products/add Failed:", err.message);
    process.exit(1);
  }

  console.log("\n=== ALL VERIFICATIONS COMPLETED SUCCESSFULLY ===");
}

runVerification();
