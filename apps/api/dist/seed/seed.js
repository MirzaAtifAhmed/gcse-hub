import { DEFAULT_SUBJECTS } from '@gcse-hub/shared';
import bcrypt from 'bcryptjs';
import { connectDb } from '../config/db.js';
import { env } from '../config/env.js';
import { CurriculumSkill } from '../models/CurriculumSkill.js';
import { CurriculumTopic } from '../models/CurriculumTopic.js';
import { QuestionTemplate } from '../models/QuestionTemplate.js';
import { Subject } from '../models/Subject.js';
import { User } from '../models/User.js';
import { mathsQuestionTemplates, mathsTopics } from './mathsSeedData.js';
async function seedAdmin() {
    const exists = await User.findOne({ email: env.ADMIN_EMAIL });
    if (!exists) {
        const passwordHash = await bcrypt.hash(env.ADMIN_PASSWORD, 12);
        await User.create({ name: 'GCSE Hub Admin', email: env.ADMIN_EMAIL, passwordHash, role: 'admin' });
        console.log(`Admin user created: ${env.ADMIN_EMAIL}`);
    }
}
async function seedSubjects() {
    for (const subject of DEFAULT_SUBJECTS) {
        await Subject.updateOne({ slug: subject.slug }, { $set: { ...subject, isActive: true } }, { upsert: true });
    }
    console.log('Subjects seeded');
}
async function seedMathsCurriculum() {
    const mathsSubject = await Subject.findOne({ slug: 'mathematics' });
    if (!mathsSubject)
        throw new Error('Mathematics subject missing.');
    const skillBySlug = new Map();
    for (const topic of mathsTopics) {
        const savedTopic = await CurriculumTopic.findOneAndUpdate({ subjectId: mathsSubject._id, slug: topic.slug }, { subjectId: mathsSubject._id, name: topic.name, slug: topic.slug, description: topic.description, years: [...topic.years], priority: topic.priority }, { new: true, upsert: true });
        for (const skill of topic.skills) {
            const savedSkill = await CurriculumSkill.findOneAndUpdate({ topicId: savedTopic._id, slug: skill.slug }, { topicId: savedTopic._id, name: skill.name, slug: skill.slug, description: skill.description, years: [...skill.years], difficulty: skill.difficulty }, { new: true, upsert: true });
            skillBySlug.set(skill.slug, { topicId: savedTopic._id, skillId: savedSkill._id });
        }
    }
    for (const template of mathsQuestionTemplates) {
        const refs = skillBySlug.get(template.skillSlug);
        if (!refs)
            continue;
        await QuestionTemplate.findOneAndUpdate({ skillId: refs.skillId, title: template.title }, { subjectId: mathsSubject._id, topicId: refs.topicId, skillId: refs.skillId, title: template.title, questionText: template.questionText, type: template.type, year: template.year, difficulty: template.difficulty, marks: template.marks, estimatedSeconds: template.estimatedSeconds, answer: template.answer, solution: template.solution, tags: [...template.tags], isActive: true }, { upsert: true });
    }
    console.log('Maths curriculum and question templates seeded');
}
async function seed() {
    await connectDb();
    await seedAdmin();
    await seedSubjects();
    await seedMathsCurriculum();
    process.exit(0);
}
seed().catch((error) => { console.error(error); process.exit(1); });
