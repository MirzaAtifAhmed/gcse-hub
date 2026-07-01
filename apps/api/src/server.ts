import { app } from './app.js';
import { connectDb } from './config/db.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';

async function bootstrap() {
  await connectDb();

  app.listen(env.PORT, () => {
    logger.info(`GCSE Hub API running on port ${env.PORT}`, { environment: env.NODE_ENV });
  });
}

bootstrap().catch((error) => {
  logger.error('Failed to start API', error);
  console.error('error');
  process.exit(1);
});
