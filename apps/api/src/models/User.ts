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
    currentLevel: { type: Number, min: 1, max: 11 },
    targetGrade: { type: Number, min: 1, max: 9 },
    examBoard: {
      type: String,
      enum: ['aqa', 'edexcel', 'ocr', 'mixed'],
      default: 'mixed',
    },
    studyGoalMinutesPerDay: { type: Number, min: 5, max: 180, default: 30 },
    learningPreferences: [
      {
        type: String,
        enum: ['worked-examples', 'diagrams', 'exam-questions', 'short-sessions'],
      },
    ],
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
