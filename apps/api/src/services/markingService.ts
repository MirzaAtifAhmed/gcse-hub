function normaliseAnswer(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/£/g, '')
    .replace(/\s+/g, '')
    .replace(/,/g, '');
}

export function markShortAnswer(submittedAnswer: string, correctAnswer: string, totalMarks: number) {
  const normalisedSubmitted = normaliseAnswer(submittedAnswer);
  const normalisedCorrect = normaliseAnswer(correctAnswer);

  const isCorrect = normalisedSubmitted === normalisedCorrect;

  return {
    isCorrect,
    awardedMarks: isCorrect ? totalMarks : 0,
  };
}
