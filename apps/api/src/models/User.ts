import bcrypt from 'bcryptjs';
import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const userSchema = new Schema(
  {
    firstName: { type: String, required: true, trim: true },
    surname: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ['student', 'parent', 'admin'],
      required: true,
      default: 'student',
    },
    currentYear: { type: Number, min: 7, max: 11 },
    target: {
      type: String,
      enum: ['foundation', 'higher', 'undecided'],
      default: 'undecided',
    },
    parentId: { type: Schema.Types.ObjectId, ref: 'User' },
    linkedChildren: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true },
);

userSchema.methods.comparePassword = function comparePassword(password: string) {
  return bcrypt.compare(password, this.passwordHash);
};

export type UserDocument = InferSchemaType<typeof userSchema> & {
  _id: mongoose.Types.ObjectId;
  comparePassword(password: string): Promise<boolean>;
  createdAt?: Date;
};

export const User = mongoose.model<UserDocument>('User', userSchema);
