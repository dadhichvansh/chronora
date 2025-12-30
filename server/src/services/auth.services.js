import Session from '../models/session.model.js';
import User from '../models/user.model.js';
import { createAccessToken, createRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { SESSION_EXPIRY_MS } from '../constants.js';
import crypto from 'crypto';

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
    throw err;
  }
}

export async function invalidateSession({ sessionId }) {
  try {
    return Session.findByIdAndUpdate(sessionId, { valid: false });
  } catch (err) {
    console.error('Error invalidating session:', err);
    throw err;
  }
}

export async function regenerateTokens(refreshToken) {
  try {
    const decoded = verifyRefreshToken(refreshToken);

    const currentSession = await Session.findById(decoded.sessionId);
    if (!currentSession || !currentSession.valid) {
      throw new Error('Invalid session');
    }

    const user = await User.findById(currentSession.userId);
    if (!user) {
      throw new Error('User not found');
    }

    const accessTokenPayload = {
      userId: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      sessionId: currentSession._id,
    };

    const refreshTokenPayload = {
      sessionId: currentSession._id,
    };

    const newAccessToken = createAccessToken(accessTokenPayload);
    const newRefreshToken = createRefreshToken(refreshTokenPayload);

    return {
      newAccessToken,
      newRefreshToken,
      user: accessTokenPayload,
    };
  } catch (err) {
    console.error('Error in regenerating tokens():', err);
    throw err;
  }
}

export function generateResetToken() {
  return crypto.randomBytes(32).toString('hex');
}

export function hashResetToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}
