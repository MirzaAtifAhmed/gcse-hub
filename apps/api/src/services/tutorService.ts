import type { GeneratedQuestion } from '@gcse-hub/types';
import { isAnswerCorrect, normaliseAnswer } from '@gcse-hub/shared';

function topicHint(topic: string) {
  const lower = topic.toLowerCase();
  if (lower.includes('percentage')) return 'Identify the multiplier or the percentage of the amount before doing the final calculation.';
  if (lower.includes('ratio')) return 'Add the ratio parts first, then find the value of one part.';
  if (lower.includes('algebra')) return 'Use inverse operations and keep both sides balanced at every step.';
  if (lower.includes('angle')) return 'Write down the angle fact first, such as angles on a line add to 180°.';
  if (lower.includes('area') || lower.includes('geometry')) return 'Choose the correct formula first, then substitute the values with units.';
  if (lower.includes('probability')) return 'Start by writing favourable outcomes over total outcomes.';
  if (lower.includes('statistics')) return 'Check whether the question asks for mean, median, mode or range before calculating.';
  return 'Underline the key numbers, decide the topic, then write the first method step before calculating.';
}

export function buildTutorHint(question: GeneratedQuestion, submittedAnswer = '') {
  const cleanSubmitted = normaliseAnswer(submittedAnswer);
  const cleanCorrect = normaliseAnswer(question.answer);
  const alreadyCorrect = submittedAnswer ? isAnswerCorrect(submittedAnswer, question.answer) : false;
  const firstStep = question.solution.steps[0]?.explanation ?? 'Start by identifying the method needed.';
  const commonMistake = question.solution.commonMistakes?.[0];

  return {
    questionId: question.id,
    alreadyCorrect,
    title: alreadyCorrect ? 'Good work' : 'Try this hint',
    hint: alreadyCorrect
      ? 'Your answer matches the expected answer. Read the worked solution to make sure your method is secure.'
      : topicHint(question.topic),
    firstStep,
    check: submittedAnswer
      ? `Your answer was read as "${cleanSubmitted || submittedAnswer}". The expected answer is read as "${cleanCorrect}".`
      : 'Enter an answer first, then use the hint to compare your method.',
    commonMistake: commonMistake ?? 'A common mistake is rushing to calculate before writing the method.',
    askYourself: [
      `What topic is this question testing? ${question.topic}`,
      'Which formula, fact or operation should come first?',
      'Have you included the correct units or final form?',
    ],
  };
}
