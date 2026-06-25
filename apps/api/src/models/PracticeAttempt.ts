import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const practiceAttemptSchema = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    questionTemplateId: {
      type: Schema.Types.ObjectId,
      ref: 'QuestionTemplate',
      required: true,
      index: true,
    },
    submittedAnswer: { type: String, required: true },
    correctAnswer: { type: String, required: true },
    isCorrect: { type: Boolean, required: true },
    awardedMarks: { type: Number, required: true },
    totalMarks: { type: Number, required: true },
    timeTakenSeconds: { type: Number },
  },
  { timestamps: true },
);

export type PracticeAttemptDocument = InferSchemaType<typeof practiceAttemptSchema> & {
  _id: mongoose.Types.ObjectId;
  createdAt?: Date;
};

export const PracticeAttempt = mongoose.model<PracticeAttemptDocument>(
  'PracticeAttempt',
  practiceAttemptSchema,
);
