// MongoDB connection string from environment variables
export const MONGO_CONNECTION_STRING = `${process.env.MONGO_URI}/${process.env.DB_NAME}`;

// Session expiry time in milliseconds (7 days)
export const SESSION_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;

// Access token expiry (short-lived, 15 mins)
export const ACCESS_TOKEN_EXPIRY = '15m';

// Refresh token expiry (longer-lived, 7 days)
export const REFRESH_TOKEN_EXPIRY = '7d';
