import bcrypt from 'bcryptjs';
import { connectDb } from '../config/db.js';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
async function seed() {
    await connectDb();
    const exists = await User.findOne({ email: env.ADMIN_EMAIL });
    if (exists) {
        console.log('Admin user already exists');
        process.exit(0);
    }
    const passwordHash = await bcrypt.hash(env.ADMIN_PASSWORD, 12);
    await User.create({
        name: 'GCSE Hub Admin',
        email: env.ADMIN_EMAIL,
        passwordHash,
        role: 'admin',
    });
    console.log(`Admin user created: ${env.ADMIN_EMAIL}`);
    process.exit(0);
}
seed().catch((error) => {
    console.error(error);
    process.exit(1);
});
