import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/Product.js";

dotenv.config();

async function inspectProducts() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB:", mongoose.connection.name);

    const products = await Product.find({});
    console.log(`Total Products in DB: ${products.length}`);
    products.forEach((p, idx) => {
      console.log(`Product ${idx + 1}: ${p.name} | ID: ${p._id}`);
      console.log(`Images:`, p.images);
    });

  } catch (err) {
    console.error("Error inspecting products:", err.message);
  } finally {
    await mongoose.disconnect();
  }
}

inspectProducts();
