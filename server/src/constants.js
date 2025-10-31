/**
 * Constants used throughout the server application.
 * For configuration values, refer to environment variables' reference in '.env.example' file.
 */

// MongoDB connection string from environment variables
export const MONGO_CONNECTION_STRING = `${process.env.MONGO_URI}/${process.env.DB_NAME}`;

// Session expiry time in milliseconds (7 days)
export const SESSION_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;

// Access & refresh token expiries
export const ACCESS_TOKEN_EXPIRY = '15m'; // short-lived, 15 mins
export const REFRESH_TOKEN_EXPIRY = '7d'; // long-lived, 7 days

// Cookie options for HTTP-only cookies
export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
};

// Cookie maxAge in milliseconds
export const ACCESS_TOKEN_COOKIE_MAX_AGE_MS = 15 * 60 * 1000; // 15 minutes
export const REFRESH_TOKEN_COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
