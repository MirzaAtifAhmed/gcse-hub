export function toAuthUser(user) {
    return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        currentYear: user.currentYear ?? undefined,
    };
}
export function toChildProfile(user) {
    return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        currentYear: user.currentYear ?? 7,
        target: (user.target ?? 'undecided'),
        createdAt: user.createdAt?.toISOString(),
    };
}
export function toSubjectDto(subject) {
    return {
        id: subject._id.toString(),
        name: subject.name,
        slug: subject.slug,
        description: subject.description,
        availableYears: subject.availableYears ?? [],
        isActive: subject.isActive ?? true,
    };
}
export function toTopicDto(topic) {
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
export function toSkillDto(skill) {
    return {
        id: skill._id.toString(),
        topicId: skill.topicId.toString(),
        name: skill.name,
        slug: skill.slug,
        description: skill.description,
        years: skill.years ?? [],
        difficulty: skill.difficulty,
    };
}
export function toQuestionTemplateDto(template) {
    return {
        id: template._id.toString(),
        subjectId: template.subjectId.toString(),
        topicId: template.topicId.toString(),
        skillId: template.skillId.toString(),
        title: template.title,
        questionText: template.questionText,
        type: template.type,
        year: template.year,
        difficulty: template.difficulty,
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
