import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';

export async function seedDemoUsers() {
  const parentEmail = 'parent@gcsehub.local';
  const childEmail = 'student@gcsehub.local';
  const passwordHash = await bcrypt.hash('Password123!', 12);

  let parent = await User.findOne({ email: parentEmail });

  if (!parent) {
    parent = await User.create({
      firstName: 'Demo',
      surname: 'Parent',
      name: 'Demo Parent',
      email: parentEmail,
      passwordHash,
      role: 'parent',
    });
  }

  let child = await User.findOne({ email: childEmail });

  if (!child) {
    child = await User.create({
      firstName: 'Demo',
      surname: 'Student',
      name: 'Demo Student',
      email: childEmail,
      passwordHash,
      role: 'student',
      currentYear: 8,
      target: 'undecided',
      parentId: parent._id,
    });
  }

  await User.findByIdAndUpdate(parent._id, { $addToSet: { linkedChildren: child._id } });

  console.log('Demo users seeded: parent@gcsehub.local / student@gcsehub.local / Password123!');
}
