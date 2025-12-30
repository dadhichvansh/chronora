import User from '../models/user.model.js';
import { comparePassword, hashPassword } from '../utils/password.js';
import { UserLoginSchema, UserRegistrationSchema } from '../validations/auth.validations.js';
import {
  createSession,
  generateResetToken,
  hashResetToken,
  invalidateSession,
} from '../services/auth.services.js';
import { verifyRefreshToken } from '../utils/jwt.js';
import {
  ACCESS_TOKEN_COOKIE_MAX_AGE_MS,
  COOKIE_OPTIONS,
  REFRESH_TOKEN_COOKIE_MAX_AGE_MS,
} from '../constants.js';
import { sendEmail } from '../utils/sendEmail.js';

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
    const refreshToken = req.cookies?.refresh_token;

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

export async function changePassword(req, res) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(404).json({
        ok: false,
        message: 'Please login to change password',
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        ok: false,
        message: 'User not found',
      });
    }

    const { currentPassword, newPassword, confirmPassword } = req.body;
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        ok: false,
        message: 'All password fields are required',
      });
    }

    const isPasswordValid = await comparePassword(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        ok: false,
        message: 'Current password is incorrect',
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        ok: false,
        message: 'New password and confirm password do not match',
      });
    }

    const hashedPassword = await hashPassword(newPassword);

    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      ok: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('Error in changePassword():', error);
    return res.status(500).json({
      ok: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}

export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        ok: false,
        message: 'Email is required',
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Do NOT reveal whether user exists (security)
      return res.status(404).json({
        ok: true,
        message: 'If the email exists, a reset link has been sent',
      });
    }

    const resetToken = generateResetToken();
    const hashedToken = hashResetToken(resetToken);

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save({ validateBeforeSave: false });

    // Here, you would typically send the resetToken to the user's email.
    // For this example, we'll just log it to the console.
    const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password?token=${resetToken}`;

    // send email - 🔥 DEV-ONLY: log token
    await sendEmail({
      to: user.email,
      subject: 'Reset your password',
      html: `
        <p>You requested a password reset</p>
        <p><a href="${resetUrl}">Reset Password</a></p>
        <p>This link expires in 10 minutes.</p>
      `,
    });

    return res.status(200).json({
      ok: true,
      message: 'If the email exists, a reset link has been sent',
    });
  } catch (error) {
    console.error('Error in forgotPassword():', error);
    return res.status(500).json({
      ok: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}

export async function resetPassword(req, res) {
  try {
    const { token, password } = req.body;

    if (!token) {
      return res.status(400).json({
        ok: false,
        message: 'Reset token is required',
      });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        ok: false,
        message: 'Password must be at least 6 characters',
      });
    }

    const hashedToken = hashResetToken(token);

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        ok: false,
        message: 'Invalid or expired reset token',
      });
    }

    // hash password
    user.password = await hashPassword(password);

    // cleanup
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return res.status(200).json({
      ok: true,
      message: 'Password reset successful',
    });
  } catch (error) {
    console.error('Error in resetPassword():', error);
    return res.status(500).json({
      ok: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}
