import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const topicMasterySchema = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    subject: { type: String, required: true, default: 'Mathematics' },
    topic: { type: String, required: true, index: true },
    attempts: { type: Number, default: 0 },
    correct: { type: Number, default: 0 },
    totalMarks: { type: Number, default: 0 },
    awardedMarks: { type: Number, default: 0 },
    masteryPercent: { type: Number, default: 0 },
    lastPractisedAt: { type: Date },
  },
  { timestamps: true },
);

topicMasterySchema.index({ studentId: 1, topic: 1 }, { unique: true });

export type TopicMasteryDocument = InferSchemaType<typeof topicMasterySchema> & {
  _id: mongoose.Types.ObjectId;
};

export const TopicMastery = mongoose.model<TopicMasteryDocument>('TopicMastery', topicMasterySchema);
