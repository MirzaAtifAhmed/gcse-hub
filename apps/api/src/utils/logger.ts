import { env } from '../config/env.js';

type LogMeta = Record<string, unknown>;

function formatMeta(meta?: LogMeta) {
  if (!meta || Object.keys(meta).length === 0) return '';
  try {
    return ` ${JSON.stringify(meta)}`;
  } catch {
    return ' [unserializable-meta]';
  }
}

export const logger = {
  info(message: string, meta?: LogMeta) {
    console.log(`[info] ${message}${formatMeta(meta)}`);
  },
  warn(message: string, meta?: LogMeta) {
    console.warn(`[warn] ${message}${formatMeta(meta)}`);
  },
  error(message: string, error?: unknown, meta?: LogMeta) {
    if (env.NODE_ENV === 'production') {
      console.error(`[error] ${message}${formatMeta(meta)}`);
      return;
    }
    console.error(`[error] ${message}${formatMeta(meta)}`, error);
  },
};
