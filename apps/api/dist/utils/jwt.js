import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
export function signToken(payload) {
    const secret = env.JWT_SECRET;
    const options = {
        expiresIn: env.JWT_EXPIRES_IN,
    };
    return jwt.sign(payload, secret, options);
}
export function verifyToken(token) {
    return jwt.verify(token, env.JWT_SECRET);
}
