import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

async function validateCredentials() {
  const currentCloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  console.log("Cloud Name: SET");
  console.log("API Key: SET");
  console.log("API Secret: SET");

  // 1. Test current configured cloud_name
  cloudinary.config({
    cloud_name: currentCloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  let currentValid = false;
  try {
    const pingResult = await cloudinary.api.ping();
    if (pingResult && pingResult.status === "ok") {
      currentValid = true;
    }
  } catch (err) {
    currentValid = false;
  }

  // 2. If current fails, test original cloud_name 'vmzqgwfx'
  let vmzqgwfxValid = false;
  if (!currentValid) {
    cloudinary.config({
      cloud_name: "vmzqgwfx",
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });
    try {
      const pingRes2 = await cloudinary.api.ping();
      if (pingRes2 && pingRes2.status === "ok") {
        vmzqgwfxValid = true;
      }
    } catch (err) {
      vmzqgwfxValid = false;
    }
  }

  console.log(`Credentials valid for current product environment (${currentCloudName}):`, currentValid ? "PASS" : "FAIL");
  if (!currentValid && vmzqgwfxValid) {
    console.log("NOTICE: Credentials are PASS for original Cloud Name: vmzqgwfx");
  }
}

validateCredentials();
