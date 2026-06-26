import type { Request, Response } from 'express';
import mongoose from 'mongoose';
import { env } from '../config/env.js';

export async function getDiagnostics(_req: Request, res: Response) {
  return res.json({
    success: true,
    data: {
      api: 'ok',
      port: env.PORT,
      nodeEnv: env.NODE_ENV,
      mongoState: mongoose.connection.readyState,
      mongoStateLabel: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] ?? 'unknown',
      clientUrl: env.CLIENT_URL,
      time: new Date().toISOString(),
    },
  });
}
