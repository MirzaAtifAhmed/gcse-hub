import { isAnswerCorrect } from '@gcse-hub/shared';

export function markShortAnswer(submittedAnswer: string, correctAnswer: string, totalMarks: number) {
  const isCorrect = isAnswerCorrect(submittedAnswer, correctAnswer);

  return {
    isCorrect,
    awardedMarks: isCorrect ? totalMarks : 0,
    totalMarks,
  };
}
