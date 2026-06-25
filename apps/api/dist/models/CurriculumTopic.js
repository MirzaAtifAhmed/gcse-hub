import mongoose, { Schema } from 'mongoose';
const curriculumTopicSchema = new Schema({
    subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', required: true, index: true },
    name: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String, required: true },
    years: [{ type: Number, min: 7, max: 11 }],
    priority: { type: Number, min: 1, max: 10, default: 5 },
}, { timestamps: true });
curriculumTopicSchema.index({ subjectId: 1, slug: 1 }, { unique: true });
export const CurriculumTopic = mongoose.model('CurriculumTopic', curriculumTopicSchema);
