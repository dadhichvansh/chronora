import mongoose from "mongoose";

// MongoDB connection string from environment variables
const connectionString = `${process.env.MONGO_URI}/${process.env.DB_NAME}`;

// Function to connect to MongoDB
export const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(connectionString);
    console.log(
      "MongoDB connected successfully:",
      connectionInstance.connection.host
    );
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit process with failure
  }
};
