import mongoose, { Schema } from 'mongoose';
const curriculumSkillSchema = new Schema({
    topicId: { type: Schema.Types.ObjectId, ref: 'CurriculumTopic', required: true, index: true },
    name: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String, required: true },
    years: [{ type: Number, min: 7, max: 11 }],
    difficulty: { type: Number, min: 1, max: 5, required: true },
}, { timestamps: true });
curriculumSkillSchema.index({ topicId: 1, slug: 1 }, { unique: true });
export const CurriculumSkill = mongoose.model('CurriculumSkill', curriculumSkillSchema);
