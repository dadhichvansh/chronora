import z from 'zod';

export const UserRegistrationSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters long'),
  email: z.email(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .max(100, 'Password must be at most 30 characters long'),
});

export const UserLoginSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .max(100, 'Password must be at most 30 characters long'),
});
