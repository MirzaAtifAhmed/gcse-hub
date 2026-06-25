import mongoose, { Schema } from 'mongoose';
const solutionStepSchema = new Schema({
    order: { type: Number, required: true },
    explanation: { type: String, required: true },
    working: { type: String },
}, { _id: false });
const markSchemePointSchema = new Schema({
    marks: { type: Number, required: true },
    description: { type: String, required: true },
}, { _id: false });
const questionSolutionSchema = new Schema({
    finalAnswer: { type: String, required: true },
    steps: [solutionStepSchema],
    markScheme: [markSchemePointSchema],
    commonMistakes: [{ type: String }],
}, { _id: false });
const questionTemplateSchema = new Schema({
    subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', required: true, index: true },
    topicId: { type: Schema.Types.ObjectId, ref: 'CurriculumTopic', required: true, index: true },
    skillId: { type: Schema.Types.ObjectId, ref: 'CurriculumSkill', required: true, index: true },
    title: { type: String, required: true },
    questionText: { type: String, required: true },
    type: {
        type: String,
        enum: ['short-answer', 'multiple-choice', 'worked'],
        default: 'short-answer',
    },
    year: { type: Number, min: 7, max: 11, required: true, index: true },
    difficulty: { type: Number, min: 1, max: 5, required: true },
    marks: { type: Number, min: 1, required: true },
    estimatedSeconds: { type: Number, min: 30, required: true },
    answer: { type: String, required: true },
    solution: { type: questionSolutionSchema, required: true },
    tags: [{ type: String }],
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
questionTemplateSchema.index({ skillId: 1, title: 1 }, { unique: true });
export const QuestionTemplate = mongoose.model('QuestionTemplate', questionTemplateSchema);
