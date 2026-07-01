import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const rawEnv = {
  ...process.env,
  // Backwards-compatible alias for common hosting docs.
  CLIENT_URL: process.env.CLIENT_URL ?? process.env.CLIENT_ORIGIN,
};

const schema = z
  .object({
    PORT: z.coerce.number().default(4004),
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    MONGODB_URI: z.string().min(1, 'MONGODB_URI is required. Use MongoDB Atlas in production.'),
    JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters.'),
    JWT_EXPIRES_IN: z.string().default('7d'),
    CLIENT_URL: z.string().url().default('http://localhost:5173'),
    ADMIN_EMAIL: z.string().email().default('admin@gcsehub.local'),
    ADMIN_PASSWORD: z.string().min(8).default('Admin123!'),
  })
  .superRefine((value, ctx) => {
    if (value.NODE_ENV === 'production' && value.JWT_SECRET.length < 32) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['JWT_SECRET'],
        message: 'JWT_SECRET should be at least 32 characters in production. Generate one with: openssl rand -hex 32',
      });
    }
  });

export const env = schema.parse(rawEnv);
