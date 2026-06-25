import { CurriculumSkill } from '../models/CurriculumSkill.js';
import { CurriculumTopic } from '../models/CurriculumTopic.js';
import { Subject } from '../models/Subject.js';
import { toSkillDto, toSubjectDto, toTopicDto } from '../utils/mappers.js';
export async function listSubjects(_req, res) {
    const subjects = await Subject.find({ isActive: true }).sort({ name: 1 });
    return res.json({ success: true, data: subjects.map(toSubjectDto) });
}
export async function listTopics(req, res) {
    const { subjectSlug, year } = req.query;
    const subject = await Subject.findOne({ slug: subjectSlug, isActive: true });
    if (!subject) {
        return res.status(404).json({ success: false, message: 'Subject not found' });
    }
    const yearNumber = year ? Number(year) : undefined;
    const query = yearNumber
        ? { subjectId: subject._id, years: yearNumber }
        : { subjectId: subject._id };
    const topics = await CurriculumTopic.find(query).sort({ priority: -1, name: 1 });
    return res.json({ success: true, data: topics.map(toTopicDto) });
}
export async function listSkills(req, res) {
    const { topicId, year } = req.query;
    if (!topicId) {
        return res.status(400).json({ success: false, message: 'topicId is required' });
    }
    const yearNumber = year ? Number(year) : undefined;
    const query = yearNumber ? { topicId, years: yearNumber } : { topicId };
    const skills = await CurriculumSkill.find(query).sort({ difficulty: 1, name: 1 });
    return res.json({ success: true, data: skills.map(toSkillDto) });
}
