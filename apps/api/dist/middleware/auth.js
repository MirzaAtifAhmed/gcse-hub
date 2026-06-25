import { User } from '../models/User.js';
import { verifyToken } from '../utils/jwt.js';
export async function requireAuth(req, res, next) {
    const header = req.headers.authorization;
    const token = header?.startsWith('Bearer ') ? header.slice(7) : req.cookies?.token;
    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    try {
        const payload = verifyToken(token);
        const user = await User.findById(payload.sub).select('_id role');
        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }
        req.user = { id: user._id.toString(), role: payload.role };
        return next();
    }
    catch {
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }
}
export function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: 'Forbidden' });
        }
        return next();
    };
}
