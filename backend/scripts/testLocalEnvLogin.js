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

const runLocalTest = async () => {
  console.log("-----------------------------------------");
  console.log("TESTING LOCALHOST (http://localhost:5000/api/auth/login)");
  console.log("-----------------------------------------");

  console.log("1. Email Login (fasal@gmail.com / fasal1307):");
  const emailRes = await testLogin("fasal@gmail.com", "fasal1307");
  console.log("   Status:", emailRes.statusCode);
  console.log("   Data:", JSON.stringify(emailRes.data, null, 2));

  console.log("\n2. Mobile Login (8129691138 / fasal1307):");
  const phoneRes = await testLogin("8129691138", "fasal1307");
  console.log("   Status:", phoneRes.statusCode);
  console.log("   Data:", JSON.stringify(phoneRes.data, null, 2));
  console.log("-----------------------------------------");
};

runLocalTest().catch(console.error);
