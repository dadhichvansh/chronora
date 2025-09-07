// MongoDB connection string from environment variables
export const MONGO_CONNECTION_STRING = `${process.env.MONGO_URI}/${process.env.DB_NAME}`;
