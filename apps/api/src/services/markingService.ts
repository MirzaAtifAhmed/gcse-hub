function normaliseText(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/£/g, '')
    .replace(/,/g, '')
    .replace(/\s+/g, '');
}

function parseNumber(value: string) {
  const normalised = normaliseText(value);
  const parsed = Number(normalised);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseFraction(value: string) {
  const normalised = normaliseText(value);
  const match = normalised.match(/^(-?\d+)\/(-?\d+)$/);

  if (!match) {
    return null;
  }

  const numerator = Number(match[1]);
  const denominator = Number(match[2]);

  if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator === 0) {
    return null;
  }

  return numerator / denominator;
}

function areNumericAnswersEquivalent(submittedAnswer: string, correctAnswer: string) {
  const submittedFraction = parseFraction(submittedAnswer);
  const correctFraction = parseFraction(correctAnswer);

  if (submittedFraction !== null && correctFraction !== null) {
    return Math.abs(submittedFraction - correctFraction) < 0.000001;
  }

  const submittedNumber = parseNumber(submittedAnswer);
  const correctNumber = parseNumber(correctAnswer);

  if (submittedNumber !== null && correctNumber !== null) {
    return Math.abs(submittedNumber - correctNumber) < 0.01;
  }

  if (submittedFraction !== null && correctNumber !== null) {
    return Math.abs(submittedFraction - correctNumber) < 0.01;
  }

  if (submittedNumber !== null && correctFraction !== null) {
    return Math.abs(submittedNumber - correctFraction) < 0.01;
  }

  return false;
}

function normaliseAlgebra(value: string) {
  return normaliseText(value).replace(/\*/g, '');
}

export function markShortAnswer(submittedAnswer: string, correctAnswer: string, totalMarks: number) {
  const isExactTextMatch = normaliseText(submittedAnswer) === normaliseText(correctAnswer);
  const isNumericMatch = areNumericAnswersEquivalent(submittedAnswer, correctAnswer);
  const isAlgebraMatch = normaliseAlgebra(submittedAnswer) === normaliseAlgebra(correctAnswer);

  const isCorrect = isExactTextMatch || isNumericMatch || isAlgebraMatch;

  return {
    isCorrect,
    awardedMarks: isCorrect ? totalMarks : 0,
  };
}
