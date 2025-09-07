import mongoose from 'mongoose';
import { MONGO_CONNECTION_STRING } from '../constants.js';

// Function to connect to MongoDB
export const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(MONGO_CONNECTION_STRING);
    console.log(
      'MongoDB connected successfully:',
      connectionInstance.connection.host
    );
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit process with failure
  }
};
