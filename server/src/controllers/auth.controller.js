import User from '../models/user.model.js';
import { hashPassword } from '../utils/password.js';
import { UserRegistrationSchema } from '../validations/auth.validations.js';
import { createSession } from '../services/auth.services.js';
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
    const userExists = await User.findOne({ email });
    if (userExists) {
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
    res.cookie('accessToken', accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: ACCESS_TOKEN_COOKIE_MAX_AGE_MS,
    });
    res.cookie('refreshToken', refreshToken, {
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
          : { id: newUser._id, username: newUser.username },
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

export async function loginUser(req, res) {}
