import mongoose from "mongoose";

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error("❌ CRITICAL CONFIGURATION ERROR: MONGO_URI environment variable is missing.");
    console.error("Please set MONGO_URI in your environment variables before running the application.");
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(mongoUri, { dbName: "flipshop" });
    console.log(`MongoDB Connected Successfully: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;