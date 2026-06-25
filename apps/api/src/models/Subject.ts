import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const subjectSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    availableYears: [{ type: Number, min: 7, max: 11 }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export type SubjectDocument = InferSchemaType<typeof subjectSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Subject = mongoose.model<SubjectDocument>('Subject', subjectSchema);
