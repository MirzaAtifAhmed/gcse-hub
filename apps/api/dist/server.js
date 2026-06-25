import { app } from './app.js';
import { connectDb } from './config/db.js';
import { env } from './config/env.js';
async function bootstrap() {
    await connectDb();
    app.listen(env.PORT, () => {
        console.log(`GCSE Hub API running on http://localhost:${env.PORT}`);
    });
}
bootstrap().catch((error) => {
    console.error('Failed to start API', error);
    process.exit(1);
});
