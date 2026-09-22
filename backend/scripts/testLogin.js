import http from "http";

const testLogin = (identifier, password) => {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ identifier, password });

    const req = http.request(
      {
        hostname: "localhost",
        port: 5000,
        path: "/api/auth/login",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(data),
        },
      },
      (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          try {
            resolve({ statusCode: res.statusCode, data: JSON.parse(body) });
          } catch (e) {
            resolve({ statusCode: res.statusCode, body });
          }
        });
      }
    );

    req.on("error", reject);
    req.write(data);
    req.end();
  });
};

const runTests = async () => {
  console.log("-----------------------------------------");
  console.log("TEST 1: Admin Login with EMAIL (admin@flipshop.com)");
  const emailRes = await testLogin("admin@flipshop.com", "Admin@123456");
  console.log("Status Code:", emailRes.statusCode);
  console.log("Success:", emailRes.data.success);
  console.log("Role:", emailRes.data.role);
  console.log("Token Present:", Boolean(emailRes.data.token));

  console.log("\n-----------------------------------------");
  console.log("TEST 2: Admin Login with MOBILE (9876543210)");
  const phoneRes = await testLogin("9876543210", "Admin@123456");
  console.log("Status Code:", phoneRes.statusCode);
  console.log("Success:", phoneRes.data.success);
  console.log("Role:", phoneRes.data.role);
  console.log("Token Present:", Boolean(phoneRes.data.token));
  console.log("-----------------------------------------");
};

runTests().catch(console.error);
