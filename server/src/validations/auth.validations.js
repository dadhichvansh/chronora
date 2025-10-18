import z from 'zod';

/**
 * Zod validation schemas
 */

const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters long')
  .max(30, 'Username must be at most 30 characters long')
  .lowercase('Username must be in lowercase');

const passwordSchema = z
  .string()
  .min(6, 'Password must be at least 6 characters long')
  .max(30, 'Password must be at most 30 characters long');

/**
 * Schema for user login/registration validation
 */

export const UserLoginSchema = z.object({
  email: z.email(),
  password: passwordSchema,
});

export const UserRegistrationSchema = UserLoginSchema.extend({
  username: usernameSchema,
});
