import User from '../models/user.model.js';
import { comparePassword, hashPassword } from '../utils/password.js';
import { UserLoginSchema, UserRegistrationSchema } from '../validations/auth.validations.js';
import { createSession, invalidateSession } from '../services/auth.services.js';
import { verifyRefreshToken } from '../utils/jwt.js';
import {
  ACCESS_TOKEN_COOKIE_MAX_AGE_MS,
  COOKIE_OPTIONS,
  REFRESH_TOKEN_COOKIE_MAX_AGE_MS,
} from '../constants.js';

export async function registerUser(req, res) {
  try {
    // Validate request body
    const result = UserRegistrationSchema.safeParse(req.body);
    if (!result.success) {
      const formattedErrors = result.error?.issues?.[0]?.message || 'Invalid input';
      return res.status(400).json({
        ok: false,
        message: 'Validation failed',
        errors: formattedErrors,
      });
    }

    // Destructure validated data
    const { username, email, password } = result.data;

    // Check if user already exists
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        ok: false,
        message: 'User with that email already exists',
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Save user to database
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Create session
    const { accessToken, refreshToken } = await createSession({ user: newUser, req });

    // Set tokens in HTTP-only cookies
    res.cookie('access_token', accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: ACCESS_TOKEN_COOKIE_MAX_AGE_MS,
    });
    res.cookie('refresh_token', refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: REFRESH_TOKEN_COOKIE_MAX_AGE_MS,
    });

    // Respond with success
    return res.status(201).json({
      ok: true,
      message: 'User registered successfully',
      user:
        process.env.NODE_ENV === 'development'
          ? newUser
          : {
              id: newUser._id,
              username: newUser.username,
            },
    });
  } catch (error) {
    console.error('Error in registerUser():', error);
    return res.status(500).json({
      ok: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}

export async function loginUser(req, res) {
  try {
    // Validate request body
    const result = UserLoginSchema.safeParse(req.body);
    if (!result.success) {
      const formattedErrors = result.error?.issues?.[0]?.message || 'Invalid input';
      return res.status(400).json({
        ok: false,
        message: 'Validation failed',
        errors: formattedErrors,
      });
    }

    // Destructure validated data
    const { email, password } = result.data;

    // Check if user already exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        ok: false,
        message: 'User with that email does not exists',
      });
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        ok: false,
        message: 'Invalid credentials',
      });
    }

    // Create session
    const { accessToken, refreshToken } = await createSession({ user, req });

    // Set tokens in HTTP-only cookies
    res.cookie('access_token', accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: ACCESS_TOKEN_COOKIE_MAX_AGE_MS,
    });
    res.cookie('refresh_token', refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: REFRESH_TOKEN_COOKIE_MAX_AGE_MS,
    });

    // Respond with success
    return res.status(200).json({
      ok: true,
      message: 'User logged in successfully',
      user:
        process.env.NODE_ENV === 'development'
          ? user
          : {
              id: user._id,
              username: user.username,
            },
    });
  } catch (error) {
    console.error('Error in loginUser():', error);
    return res.status(500).json({
      ok: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}

export async function logoutUser(req, res) {
  try {
    // Get token from cookies
    const refreshToken = req.cookies?.refreshToken;

    // If token is missing, respond with error
    if (!refreshToken) {
      return res.status(400).json({
        ok: false,
        message: 'No token found in cookies',
      });
    }

    // Decode the token (verify it first)
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded?.sessionId) {
      return res.status(400).json({
        ok: false,
        message: 'Invalid token',
      });
    }

    // Invalidate the session in the database
    await invalidateSession({ sessionId: decoded.sessionId });

    // Clear authentication cookies
    res.clearCookie('access_token', COOKIE_OPTIONS);
    res.clearCookie('refresh_token', COOKIE_OPTIONS);

    // Respond with success
    return res.status(200).json({
      ok: true,
      message: 'User logged out successfully',
    });
  } catch (error) {
    console.error('Error in logoutUser():', error);
    return res.status(500).json({
      ok: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}

export function getCurrentUser(req, res) {
  try {
    // Get user from request (set by auth middleware)
    const user = req.user;
    if (!user) {
      return res.status(404).json({
        ok: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      ok: true,
      user:
        process.env.NODE_ENV === 'development'
          ? user
          : {
              id: user._id,
              username: user.username,
            },
    });
  } catch (error) {
    console.error('Error in getCurrentUser():', error);
    return res.status(500).json({
      ok: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}
