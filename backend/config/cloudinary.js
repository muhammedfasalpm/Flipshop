import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load backend .env file with override: true
const envPath = path.resolve(__dirname, "../.env");
dotenv.config({ path: envPath, override: true });

const apiKey = process.env.CLOUDINARY_API_KEY || "";
const maskedApiKey = apiKey.length >= 8
  ? `${apiKey.substring(0, 4)}****${apiKey.substring(apiKey.length - 4)}`
  : apiKey;

console.log("--- CLOUDINARY RUNTIME CONFIGURATION ---");
console.log(`CLOUDINARY_CLOUD_NAME=${process.env.CLOUDINARY_CLOUD_NAME}`);
console.log(`CLOUDINARY_API_KEY=${maskedApiKey}`);
console.log(`CLOUDINARY_API_SECRET=${process.env.CLOUDINARY_API_SECRET ? "SET" : "NOT SET"}`);
console.log(`API Key Source: backend/.env (${envPath})`);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;
