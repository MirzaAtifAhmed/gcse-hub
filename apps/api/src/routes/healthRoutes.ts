import { type Request, type Response, Router } from 'express';
import mongoose from 'mongoose';

const router = Router();

const readyStateLabels: Record<number, string> = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting',
};

function getMongoState() {
  const readyState = mongoose.connection.readyState;
  const connected = readyState === 1;

  return {
    connected,
    readyState,
    state: readyStateLabels[readyState] ?? 'unknown',
    databaseName: mongoose.connection.name || null,
    host: mongoose.connection.host || null,
  };
}

router.get('/health', (_req, res) => {
  const mongo = getMongoState();

  res.status(200).json({
    success: true,
    status: mongo.connected ? 'ok' : 'degraded',
    service: 'gcse-hub-api',
    version: process.env.npm_package_version ?? '1.0.0',
    environment: process.env.NODE_ENV ?? 'development',
    mongodb: mongo.state,
    mongo,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

async function mongoHealth(_req: Request, res: Response) {
  const mongo = getMongoState();

  try {
    if (!mongoose.connection.db) {
      return res.status(503).json({
        success: false,
        status: 'degraded',
        service: 'gcse-hub-api',
        database: mongo.state,
        mongoPing: false,
        mongo,
        message: 'MongoDB connection has not been established yet.',
        timestamp: new Date().toISOString(),
      });
    }

    await mongoose.connection.db.admin().ping();

    return res.status(200).json({
      success: true,
      status: 'ok',
      service: 'gcse-hub-api',
      database: mongo.state,
      mongoPing: true,
      readyState: mongo.readyState,
      databaseName: mongo.databaseName,
      host: mongo.host,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('MongoDB health check failed', error);

    return res.status(503).json({
      success: false,
      status: 'degraded',
      service: 'gcse-hub-api',
      database: mongo.state,
      mongoPing: false,
      readyState: mongo.readyState,
      message: error instanceof Error ? error.message : 'MongoDB ping failed',
      timestamp: new Date().toISOString(),
    });
  }
}

router.get('/health/db', mongoHealth);
router.get('/health/mongo', mongoHealth);

router.get('/health/full', (_req, res) => {
  const mongo = getMongoState();

  res.status(mongo.connected ? 200 : 503).json({
    success: mongo.connected,
    api: 'ok',
    mongodb: mongo.connected ? 'ok' : 'failed',
    service: 'gcse-hub-api',
    version: process.env.npm_package_version ?? '1.0.0',
    node: process.version,
    environment: process.env.NODE_ENV ?? 'development',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    mongo,
    timestamp: new Date().toISOString(),
  });
});

export { router as healthRoutes };
