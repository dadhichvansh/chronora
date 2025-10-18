import Session from '../models/session.model.js';
import { SESSION_EXPIRY_MS } from '../constants.js';
import { createAccessToken, createRefreshToken } from '../utils/jwt.js';

export async function createSession({ user, req }) {
  try {
    // Create new session
    const session = await Session.create({
      userId: user._id,
      userAgent: req.headers['user-agent'] || 'unknown',
      requestIp: req.clientIp || req.ip || 'unknown',
      expiresAt: new Date(Date.now() + SESSION_EXPIRY_MS),
    });

    // Update lastLogin timestamp
    user.lastLogin = new Date();
    await user.save();

    // Create tokens
    const accessToken = createAccessToken({
      userId: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      sessionId: session._id,
    });

    const refreshToken = createRefreshToken({
      sessionId: session._id,
    });

    // Return tokens, finally
    return { accessToken, refreshToken };
  } catch (err) {
    console.error('Error creating session:', err);
    throw new Error('Could not create session');
  }
}
