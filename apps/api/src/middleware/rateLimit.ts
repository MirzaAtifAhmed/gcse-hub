import type { NextFunction, Request, Response } from 'express';

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

export function simpleRateLimit(options = { windowMs: 60_000, max: 120 }) {
  return (req: Request, res: Response, next: NextFunction) => {
    const forwardedFor = req.headers['x-forwarded-for'];
    const key = Array.isArray(forwardedFor)
      ? forwardedFor[0]
      : forwardedFor?.split(',')[0]?.trim() || req.ip || 'unknown';

    const now = Date.now();
    const bucket = buckets.get(key);

    if (!bucket || bucket.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + options.windowMs });
      return next();
    }

    bucket.count += 1;

    if (bucket.count > options.max) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please wait a moment and try again.',
      });
    }

    return next();
  };
}
