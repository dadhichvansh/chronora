import { regenerateTokens } from '../services/auth.services.js';
import { verifyAccessToken } from '../utils/jwt.js';
import {
  ACCESS_TOKEN_COOKIE_MAX_AGE_MS,
  COOKIE_OPTIONS,
  REFRESH_TOKEN_COOKIE_MAX_AGE_MS,
} from '../constants.js';

export async function authMiddleware(req, res, next) {
  try {
    // Get tokens from cookies
    const accessToken = req.cookies.access_token;
    const refreshToken = req.cookies.refresh_token;

    // Check if access and refresh tokens are present
    if (!accessToken && !refreshToken) {
      req.user = null;
      return next();
    }

    // Check if access token is present
    if (accessToken) {
      try {
        const decoded = verifyAccessToken(accessToken);
        console.log(decoded);
        req.user = decoded;
        return next();
      } catch (err) {
        console.error('Access token verification failed:', err);
        req.user = null;
        return next();
      }
    }

    // Check if only refresh token is present
    if (refreshToken) {
      try {
        const { newAccessToken, newRefreshToken, user } = await regenerateTokens(refreshToken);
        req.user = user;

        res.cookie('access_token', newAccessToken, {
          ...COOKIE_OPTIONS,
          maxAge: ACCESS_TOKEN_COOKIE_MAX_AGE_MS,
        });

        res.cookie('refresh_token', newRefreshToken, {
          ...COOKIE_OPTIONS,
          maxAge: REFRESH_TOKEN_COOKIE_MAX_AGE_MS,
        });

        return next();
      } catch (err) {
        console.error('Error while regenerating tokens:', err);

        // Clear cookies and set user as null upon refresh failure
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
        req.user = null;

        return next();
      }
    }

    req.user = null;
    return next();
  } catch (error) {
    console.error('Error in authMiddleware():', error);
    return next();
  }
}
