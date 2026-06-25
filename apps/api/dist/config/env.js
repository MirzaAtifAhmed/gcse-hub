import dotenv from 'dotenv';
import { z } from 'zod';
dotenv.config();
const schema = z.object({
    PORT: z.coerce.number().default(4004),
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    MONGODB_URI: z.string().min(1),
    JWT_SECRET: z.string().min(16),
    JWT_EXPIRES_IN: z.string().default('7d'),
    CLIENT_URL: z.string().url().default('http://localhost:5173'),
    ADMIN_EMAIL: z.string().email().default('admin@gcsehub.local'),
    ADMIN_PASSWORD: z.string().min(8).default('Admin123!'),
});
export const env = schema.parse(process.env);
