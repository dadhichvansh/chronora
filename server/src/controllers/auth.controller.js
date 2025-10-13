import User from '../models/user.model.js';
import { hashPassword } from '../utils/password.js';
import { UserRegistrationSchema } from '../validations/auth.validations.js';

export async function registerUser(req, res) {
  try {
    // Validate request body
    const {
      success,
      data: { username, email, password },
      error,
    } = UserRegistrationSchema.safeParse(req.body);
    if (!success) {
      return res.status(400).json({
        ok: false,
        message: 'Validation failed',
        errors:
          process.env.NODE_ENV === 'development' ? error.errors : undefined,
      });
    }

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

    // Create session (to be implemented)

    // Respond with success
    return res.status(201).json({
      ok: true,
      message: 'User registered successfully',
      user: process.env.NODE_ENV === 'development' ? newUser : null,
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
