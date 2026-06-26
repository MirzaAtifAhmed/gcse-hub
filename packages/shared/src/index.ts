export const APP_NAME = 'GCSE Hub';
export const APP_TAGLINE = 'Your GCSE Journey Starts Here';

export const DEFAULT_SUBJECTS = [
  {
    name: 'Mathematics',
    slug: 'mathematics',
    description: 'Number, algebra, ratio, geometry, probability and GCSE problem solving.',
    availableYears: [7, 8, 9, 10, 11],
  },
  {
    name: 'English',
    slug: 'english',
    description: 'Language, literature, writing, comprehension and GCSE exam technique.',
    availableYears: [7, 8, 9, 10, 11],
  },
  {
    name: 'Science',
    slug: 'science',
    description: 'Biology, chemistry and physics foundations through GCSE.',
    availableYears: [7, 8, 9, 10, 11],
  },
] as const;

export function clampYear(year: number) {
  return Math.max(7, Math.min(11, year));
}

function gcd(a: number, b: number): number {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}

function parseFraction(value: string): number | null {
  const match = value.match(/^(-?\d+)\/(\d+)$/);
  if (!match) return null;
  const numerator = Number(match[1]);
  const denominator = Number(match[2]);
  if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator === 0) return null;
  return numerator / denominator;
}

function simplifyFractionText(value: string): string {
  const match = value.match(/^(-?\d+)\/(\d+)$/);
  if (!match) return value;
  const numerator = Number(match[1]);
  const denominator = Number(match[2]);
  if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator === 0) return value;
  const divisor = gcd(numerator, denominator);
  return `${numerator / divisor}/${denominator / divisor}`;
}

export function normaliseAnswer(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/,/g, '')
    .replace(/£/g, '')
    .replace(/\s+/g, '')
    .replace(/°/g, '')
    .replace(/²/g, '2')
    .replace(/³/g, '3')
    .replace(/degrees?/g, '')
    .replace(/degs?/g, '')
    .replace(/percent/g, '%')
    .replace(/percentage/g, '%')
    .replace(/squarecentimetres/g, 'cm2')
    .replace(/squarecentimeters/g, 'cm2')
    .replace(/centimetressquared/g, 'cm2')
    .replace(/centimeterssquared/g, 'cm2')
    .replace(/squaremeters/g, 'm2')
    .replace(/squaremetres/g, 'm2')
    .replace(/metressquared/g, 'm2')
    .replace(/meterssquared/g, 'm2')
    .replace(/squarecm/g, 'cm2')
    .replace(/sqcm/g, 'cm2')
    .replace(/squarem/g, 'm2')
    .replace(/sqm/g, 'm2')
    .replace(/centimetres/g, 'cm')
    .replace(/centimeters/g, 'cm')
    .replace(/metres/g, 'm')
    .replace(/meters/g, 'm')
    .replace(/\.0+($|[^\d])/g, '$1')
    .replace(/\.0+$/g, '');
}

export function isAnswerCorrect(submittedAnswer: string, correctAnswer: string) {
  const submitted = normaliseAnswer(submittedAnswer);
  const correct = normaliseAnswer(correctAnswer);

  if (submitted === correct) return true;

  const submittedNumber = Number(submitted.replace(/%$/g, ''));
  const correctNumber = Number(correct.replace(/%$/g, ''));
  if (Number.isFinite(submittedNumber) && Number.isFinite(correctNumber) && Math.abs(submittedNumber - correctNumber) < 0.000001) {
    return true;
  }

  const submittedFraction = parseFraction(simplifyFractionText(submitted));
  const correctFraction = parseFraction(simplifyFractionText(correct));
  if (submittedFraction !== null && correctFraction !== null && Math.abs(submittedFraction - correctFraction) < 0.000001) {
    return true;
  }

  if (submittedFraction !== null && Number.isFinite(correctNumber) && Math.abs(submittedFraction - correctNumber) < 0.000001) {
    return true;
  }

  if (correctFraction !== null && Number.isFinite(submittedNumber) && Math.abs(correctFraction - submittedNumber) < 0.000001) {
    return true;
  }

  return false;
}
