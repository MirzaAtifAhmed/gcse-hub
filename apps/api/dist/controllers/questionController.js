import { z } from 'zod';
import { CurriculumSkill } from '../models/CurriculumSkill.js';
import { CurriculumTopic } from '../models/CurriculumTopic.js';
import { QuestionTemplate } from '../models/QuestionTemplate.js';
import { Subject } from '../models/Subject.js';
import { toQuestionTemplateDto } from '../utils/mappers.js';
const practiceQuerySchema = z.object({
    subjectSlug: z.string().default('mathematics'),
    year: z.coerce.number().min(7).max(11).default(8),
    limit: z.coerce.number().min(1).max(20).default(10),
});
export async function listPracticeQuestions(req, res) {
    const query = practiceQuerySchema.parse(req.query);
    const subject = await Subject.findOne({ slug: query.subjectSlug, isActive: true });
    if (!subject) {
        return res.status(404).json({ success: false, message: 'Subject not found' });
    }
    const topics = await CurriculumTopic.find({ subjectId: subject._id, years: query.year }).select('_id');
    const topicIds = topics.map((topic) => topic._id);
    const skills = await CurriculumSkill.find({ topicId: { $in: topicIds }, years: query.year }).select('_id');
    const skillIds = skills.map((skill) => skill._id);
    const questions = await QuestionTemplate.find({
        subjectId: subject._id,
        topicId: { $in: topicIds },
        skillId: { $in: skillIds },
        year: query.year,
        isActive: true,
    })
        .sort({ difficulty: 1, title: 1 })
        .limit(query.limit);
    return res.json({ success: true, data: questions.map(toQuestionTemplateDto) });
}
