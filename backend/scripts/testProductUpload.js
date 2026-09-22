const API_URL = "http://localhost:5000";

async function testProductUpload() {
  console.log("=== STARTING PRODUCT UPLOAD INTEGRATION TEST ===");

  // 1. Admin Login
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
    console.log("1. Admin Login status:", loginRes.status, "Token:", adminToken ? "RECEIVED" : "NONE");
  } catch (err) {
    console.error("1. Admin Login Failed:", err.message);
    return;
  }

  // 2. Base64 1x1 transparent PNG file
  const base64Png = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
  const buffer = Buffer.from(base64Png, "base64");
  const blob = new Blob([buffer], { type: "image/png" });

  const formData = new FormData();
  formData.append("name", "FlipPro Wireless Headphones");
  formData.append("description", "High-fidelity wireless sound with spatial audio.");
  formData.append("category", "Electronics");
  formData.append("brand", "FlipAudio");
  formData.append("price", "2999");
  formData.append("stock", "30");
  formData.append("images", blob, "headphones_sample.png");

  // 3. Test POST /api/products/add
  try {
    const addRes = await fetch(`${API_URL}/api/products/add`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
      body: formData,
    });
    const addData = await addRes.json();
    console.log("2. Add Product Response status:", addRes.status);
    console.log("Add Product Result:\n", JSON.stringify(addData, null, 2));

    // If product created, cleanup test product from DB
    if (addData.product?._id) {
      const delRes = await fetch(`${API_URL}/api/products/delete/${addData.product._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
      const delData = await delRes.json();
      console.log("3. Cleaned up test product status:", delRes.status, delData.message);
    }
  } catch (err) {
    console.error("2. Add product failed:", err.message);
  }

  console.log("=== PRODUCT UPLOAD TEST COMPLETED ===");
}

testProductUpload();
