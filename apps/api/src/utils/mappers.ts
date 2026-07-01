import type {
  AuthUser,
  ChildProfile,
  CurriculumSkill as CurriculumSkillDto,
  CurriculumTopic as CurriculumTopicDto,
  QuestionTemplate as QuestionTemplateDto,
  Subject as SubjectDto,
} from '@gcse-hub/types';
import type { CurriculumSkillDocument } from '../models/CurriculumSkill.js';
import type { CurriculumTopicDocument } from '../models/CurriculumTopic.js';
import type { QuestionTemplateDocument } from '../models/QuestionTemplate.js';
import type { SubjectDocument } from '../models/Subject.js';
import type { UserDocument } from '../models/User.js';

export function toAuthUser(user: UserDocument): AuthUser {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role as AuthUser['role'],
    currentYear: user.currentYear ?? undefined,
    target: user.target ?? undefined,
    currentLevel: user.currentLevel ?? undefined,
    targetGrade: user.targetGrade ?? undefined,
    examBoard: user.examBoard ?? undefined,
    studyGoalMinutesPerDay: user.studyGoalMinutesPerDay ?? undefined,
    learningPreferences: user.learningPreferences ?? [],
  };
}

export function toChildProfile(user: UserDocument): ChildProfile {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    currentYear: user.currentYear ?? 7,
    target: (user.target ?? 'undecided') as ChildProfile['target'],
    currentLevel: user.currentLevel ?? undefined,
    targetGrade: user.targetGrade ?? undefined,
    examBoard: user.examBoard ?? undefined,
    studyGoalMinutesPerDay: user.studyGoalMinutesPerDay ?? undefined,
    learningPreferences: user.learningPreferences ?? [],
    createdAt: user.createdAt?.toISOString(),
  };
}

export function toSubjectDto(subject: SubjectDocument): SubjectDto {
  return {
    id: subject._id.toString(),
    name: subject.name,
    slug: subject.slug,
    description: subject.description,
    availableYears: subject.availableYears ?? [],
    isActive: subject.isActive ?? true,
  };
}

export function toTopicDto(topic: CurriculumTopicDocument): CurriculumTopicDto {
  return {
    id: topic._id.toString(),
    subjectId: topic.subjectId.toString(),
    name: topic.name,
    slug: topic.slug,
    description: topic.description,
    years: topic.years ?? [],
    priority: topic.priority ?? 5,
  };
}

export function toSkillDto(skill: CurriculumSkillDocument): CurriculumSkillDto {
  return {
    id: skill._id.toString(),
    topicId: skill.topicId.toString(),
    name: skill.name,
    slug: skill.slug,
    description: skill.description,
    years: skill.years ?? [],
    difficulty: skill.difficulty as CurriculumSkillDto['difficulty'],
  };
}

export function toQuestionTemplateDto(template: QuestionTemplateDocument): QuestionTemplateDto {
  return {
    id: template._id.toString(),
    subjectId: template.subjectId.toString(),
    topicId: template.topicId.toString(),
    skillId: template.skillId.toString(),
    title: template.title,
    questionText: template.questionText,
    type: template.type as QuestionTemplateDto['type'],
    year: template.year,
    difficulty: template.difficulty as QuestionTemplateDto['difficulty'],
    marks: template.marks,
    estimatedSeconds: template.estimatedSeconds,
    answer: template.answer,
    solution: {
      finalAnswer: template.solution.finalAnswer,
      steps: template.solution.steps.map((step) => ({
        order: step.order,
        explanation: step.explanation,
        working: step.working ?? undefined,
      })),
      markScheme: template.solution.markScheme.map((point) => ({
        marks: point.marks,
        description: point.description,
      })),
      commonMistakes: template.solution.commonMistakes ?? [],
    },
    tags: template.tags ?? [],
  };
}
