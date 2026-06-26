export type AnswerCheckResult = {
  isCorrect: boolean;
  missingUnit: boolean;
  normalisedUserAnswer: string;
  normalisedCorrectAnswer: string;
};

const DEGREE_WORDS = /(?:degrees?|degs?)/g;

function normaliseUnits(value: string): string {
  return value
    .replace(/²/g, '2')
    .replace(/³/g, '3')
    .replace(/squarecentimetres/g, 'cm2')
    .replace(/squarecentimeters/g, 'cm2')
    .replace(/centimetressquared/g, 'cm2')
    .replace(/centimeterssquared/g, 'cm2')
    .replace(/squarecm/g, 'cm2')
    .replace(/sqcm/g, 'cm2')
    .replace(/centimetres/g, 'cm')
    .replace(/centimeters/g, 'cm')
    .replace(/millimetres/g, 'mm')
    .replace(/millimeters/g, 'mm')
    .replace(/metres/g, 'm')
    .replace(/meters/g, 'm');
}

export function normaliseAnswer(value: string): string {
  return normaliseUnits(value)
    .toLowerCase()
    .trim()
    .replace(/,/g, '')
    .replace(/£/g, '')
    .replace(/°/g, '')
    .replace(DEGREE_WORDS, '')
    .replace(/\s+/g, '');
}

function extractNumber(value: string): string | null {
  const match = value.match(/-?\d+(?:\.\d+)?/);
  return match?.[0] ?? null;
}

function hasUnit(value: string): boolean {
  const normalised = normaliseUnits(value.toLowerCase()).replace(/\s+/g, '');
  return /(?:°|degrees?|degs?|cm2|cm3|mm2|mm3|m2|m3|cm|mm|m|kg|g|ml|l)/.test(normalised);
}

export function checkAnswer(userAnswer: string, correctAnswer: string): AnswerCheckResult {
  const normalisedUserAnswer = normaliseAnswer(userAnswer);
  const normalisedCorrectAnswer = normaliseAnswer(correctAnswer);

  if (normalisedUserAnswer === normalisedCorrectAnswer) {
    return {
      isCorrect: true,
      missingUnit: false,
      normalisedUserAnswer,
      normalisedCorrectAnswer,
    };
  }

  const userNumber = extractNumber(normalisedUserAnswer);
  const correctNumber = extractNumber(normalisedCorrectAnswer);
  const numericValueMatches = userNumber !== null && correctNumber !== null && userNumber === correctNumber;
  const correctHasUnit = hasUnit(correctAnswer);
  const userHasUnit = hasUnit(userAnswer);

  if (numericValueMatches && correctHasUnit && !userHasUnit) {
    return {
      isCorrect: true,
      missingUnit: true,
      normalisedUserAnswer,
      normalisedCorrectAnswer,
    };
  }

  return {
    isCorrect: false,
    missingUnit: false,
    normalisedUserAnswer,
    normalisedCorrectAnswer,
  };
}

export function isAnswerCorrect(userAnswer: string, correctAnswer: string): boolean {
  return checkAnswer(userAnswer, correctAnswer).isCorrect;
}
