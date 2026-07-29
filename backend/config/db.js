import mongoose from "mongoose";

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/flipshop";

  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected Successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error(
      "⚠️ NOTE FOR PRODUCTION / RENDER DEPLOYMENT:\n" +
      "If deploying to cloud platforms (like Render), 127.0.0.1:27017 will fail.\n" +
      "Please set the MONGO_URI environment variable in your deployment dashboard to a MongoDB Atlas cluster URI.\n" +
      "Example: mongodb+srv://<username>:<password>@cluster0.mongodb.net/flipshop?retryWrites=true&w=majority"
    );
  }
};

export default connectDB;