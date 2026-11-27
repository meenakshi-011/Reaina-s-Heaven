import mongoose from "mongoose";

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGO_URI || "";
    if (mongoUri.includes("w=majorit") && !mongoUri.includes("w=majority")) {
      mongoUri = mongoUri.replace("w=majorit", "w=majority");
    }

    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000, // Fail fast after 5 seconds instead of 30
    });
    console.log("MongoDB Connected 🚀");
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};
export default connectDB;