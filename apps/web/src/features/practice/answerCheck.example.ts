import { checkMathsAnswer } from '../../utils/answerNormalise';

export function isAnswerCorrect(userAnswer: string, correctAnswer: string): boolean {
  return checkMathsAnswer(userAnswer, correctAnswer, {
    requireUnit: false,
    numericTolerance: 0.000001,
  }).isCorrect;
}

export function getAnswerFeedback(userAnswer: string, correctAnswer: string): string | undefined {
  return checkMathsAnswer(userAnswer, correctAnswer, {
    requireUnit: false,
    numericTolerance: 0.000001,
  }).message;
}
