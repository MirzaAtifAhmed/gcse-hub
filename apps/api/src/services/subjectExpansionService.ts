import type { GeneratedQuestion, SubjectLaunchSummary } from '@gcse-hub/types';

function makeQuestion(subject: string, topic: string, skill: string, questionText: string, answer: string, year = 8): GeneratedQuestion {
  return {
    id: `${subject.toLowerCase()}-${topic.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
    title: `${subject}: ${topic}`,
    questionText,
    topic,
    skill,
    type: 'worked',
    year,
    difficulty: 2,
    marks: 3,
    estimatedSeconds: 180,
    answer,
    solution: {
      finalAnswer: answer,
      steps: [
        { order: 1, explanation: 'Identify what the question is asking.' },
        { order: 2, explanation: 'Use the subject method or evidence.' },
        { order: 3, explanation: 'Check the final response answers the question.' },
      ],
      markScheme: [
        { marks: 1, description: 'Relevant knowledge or method.' },
        { marks: 1, description: 'Clear explanation or working.' },
        { marks: 1, description: 'Accurate final answer.' },
      ],
    },
    tags: [subject.toLowerCase(), topic.toLowerCase(), `year-${year}`, 'subject-expansion'],
  };
}

export function getSubjectLaunchSummaries(): SubjectLaunchSummary[] {
  return [
    {
      subject: 'Mathematics',
      status: 'ready',
      years: [7, 8, 9, 10, 11],
      strands: ['Number', 'Algebra', 'Ratio', 'Geometry', 'Probability', 'Statistics'],
      sampleTopics: ['Percentages', 'Linear equations', 'Angles', 'Probability trees'],
    },
    {
      subject: 'English',
      status: 'starter',
      years: [7, 8, 9, 10, 11],
      strands: ['Reading', 'Writing', 'Language analysis', 'Literature', 'Spoken language'],
      sampleTopics: ['Inference', 'Vocabulary choice', 'Paragraph structure', 'Quotation analysis'],
    },
    {
      subject: 'Science',
      status: 'starter',
      years: [7, 8, 9, 10, 11],
      strands: ['Biology', 'Chemistry', 'Physics', 'Required practicals', 'Working scientifically'],
      sampleTopics: ['Cells', 'Particles', 'Forces', 'Energy transfer'],
    },
  ];
}

export function getSubjectStarterQuestions(subject: string, year = 8): GeneratedQuestion[] {
  const normalised = subject.toLowerCase();
  if (normalised === 'english') {
    return [
      makeQuestion('English', 'Reading inference', 'Use evidence', 'Read the sentence: “The room fell silent as Aisha opened the envelope.” What can you infer about the importance of the envelope?', 'The envelope is important because everyone stops and focuses on it.', year),
      makeQuestion('English', 'Writing structure', 'Paragraph planning', 'Write one topic sentence for a paragraph arguing that school libraries are important.', 'School libraries are important because they give every student access to books, study space and support.', year),
    ];
  }

  if (normalised === 'science') {
    return [
      makeQuestion('Science', 'Forces', 'Resultant force', 'A box has a 10 N force to the right and a 4 N force to the left. What is the resultant force?', '6 N to the right', year),
      makeQuestion('Science', 'Cells', 'Cell structure', 'Name one part found in plant cells but not animal cells.', 'Cell wall', year),
    ];
  }

  return [];
}
