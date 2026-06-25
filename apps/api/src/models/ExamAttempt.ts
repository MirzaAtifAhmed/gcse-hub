import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const answerSchema = new Schema(
  {
    questionId: { type: String, required: true },
    answer: { type: String, default: '' },
    isCorrect: { type: Boolean },
    awardedMarks: { type: Number },
    totalMarks: { type: Number, required: true },
  },
  { _id: false },
);

const examAttemptSchema = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    paper: { type: Schema.Types.Mixed, required: true },
    answers: [answerSchema],
    status: { type: String, enum: ['in-progress', 'submitted'], default: 'in-progress' },
    submittedAt: { type: Date },
    totalMarks: { type: Number, default: 0 },
    awardedMarks: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export type ExamAttemptDocument = InferSchemaType<typeof examAttemptSchema> & {
  _id: mongoose.Types.ObjectId;
  createdAt?: Date;
};

export const ExamAttempt = mongoose.model<ExamAttemptDocument>('ExamAttempt', examAttemptSchema);
