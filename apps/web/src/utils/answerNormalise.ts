export type AnswerUnit =
  | 'cm2'
  | 'cm3'
  | 'm2'
  | 'm3'
  | 'mm2'
  | 'mm3'
  | 'degrees'
  | 'unknown';

export interface ParsedAnswer {
  raw: string;
  normalised: string;
  numericValue: number | null;
  unit: AnswerUnit;
  hasUnit: boolean;
}

const UNIT_REPLACEMENTS: Array<[RegExp, string]> = [
  [/centimetresquared/g, 'cm2'],
  [/centimetersquared/g, 'cm2'],
  [/squarecentimetres/g, 'cm2'],
  [/squarecentimeters/g, 'cm2'],
  [/squarecm/g, 'cm2'],
  [/sqcm/g, 'cm2'],
  [/cm²/g, 'cm2'],
  [/centimetrescubed/g, 'cm3'],
  [/centimeterscubed/g, 'cm3'],
  [/cubiccentimetres/g, 'cm3'],
  [/cubiccentimeters/g, 'cm3'],
  [/cubiccm/g, 'cm3'],
  [/cm³/g, 'cm3'],
  [/metressquared/g, 'm2'],
  [/meterssquared/g, 'm2'],
  [/squaremetres/g, 'm2'],
  [/squaremeters/g, 'm2'],
  [/squarem/g, 'm2'],
  [/sqm/g, 'm2'],
  [/m²/g, 'm2'],
  [/metrescubed/g, 'm3'],
  [/meterscubed/g, 'm3'],
  [/cubicmetres/g, 'm3'],
  [/cubicmeters/g, 'm3'],
  [/cubicm/g, 'm3'],
  [/m³/g, 'm3'],
  [/millimetresquared/g, 'mm2'],
  [/millimetersquared/g, 'mm2'],
  [/squaremillimetres/g, 'mm2'],
  [/squaremillimeters/g, 'mm2'],
  [/squaremm/g, 'mm2'],
  [/sqmm/g, 'mm2'],
  [/mm²/g, 'mm2'],
  [/millimetrescubed/g, 'mm3'],
  [/millimeterscubed/g, 'mm3'],
  [/cubicmillimetres/g, 'mm3'],
  [/cubicmillimeters/g, 'mm3'],
  [/cubicmm/g, 'mm3'],
  [/mm³/g, 'mm3'],
  [/degrees/g, 'degrees'],
  [/degree/g, 'degrees'],
  [/deg/g, 'degrees'],
  [/°/g, 'degrees'],
];

export function normaliseAnswer(value: string): string {
  let result = value
    .toLowerCase()
    .trim()
    .replace(/,/g, '')
    .replace(/\s+/g, '')
    .replace(/²/g, '2')
    .replace(/³/g, '3');

  for (const [pattern, replacement] of UNIT_REPLACEMENTS) {
    result = result.replace(pattern, replacement);
  }

  return result;
}

export function parseAnswer(value: string): ParsedAnswer {
  const normalised = normaliseAnswer(value);
  const numericMatch = normalised.match(/-?\d+(?:\.\d+)?/);
  const numericValue = numericMatch ? Number(numericMatch[0]) : null;

  const unit = detectUnit(normalised);

  return {
    raw: value,
    normalised,
    numericValue,
    unit,
    hasUnit: unit !== 'unknown',
  };
}

function detectUnit(value: string): AnswerUnit {
  if (value.includes('cm2')) return 'cm2';
  if (value.includes('cm3')) return 'cm3';
  if (value.includes('mm2')) return 'mm2';
  if (value.includes('mm3')) return 'mm3';
  if (value.includes('m2')) return 'm2';
  if (value.includes('m3')) return 'm3';
  if (value.includes('degrees')) return 'degrees';
  return 'unknown';
}

export interface AnswerCheckResult {
  isCorrect: boolean;
  isValueCorrect: boolean;
  isUnitCorrect: boolean;
  missingUnit: boolean;
  message?: string;
}

export function checkMathsAnswer(
  userAnswer: string,
  correctAnswer: string,
  options: { requireUnit?: boolean; numericTolerance?: number } = {},
): AnswerCheckResult {
  const requireUnit = options.requireUnit ?? false;
  const tolerance = options.numericTolerance ?? 0.000001;

  const user = parseAnswer(userAnswer);
  const correct = parseAnswer(correctAnswer);

  const isNumericQuestion = correct.numericValue !== null;
  const expectedHasUnit = correct.hasUnit;

  const isValueCorrect = isNumericQuestion
    ? user.numericValue !== null && Math.abs(user.numericValue - correct.numericValue!) <= tolerance
    : user.normalised === correct.normalised;

  const isUnitCorrect = !expectedHasUnit || user.unit === correct.unit;
  const missingUnit = Boolean(expectedHasUnit && !user.hasUnit && isValueCorrect);

  const isCorrect = requireUnit
    ? isValueCorrect && isUnitCorrect
    : isValueCorrect && (isUnitCorrect || missingUnit);

  return {
    isCorrect,
    isValueCorrect,
    isUnitCorrect,
    missingUnit,
    message: missingUnit
      ? `Correct value, but remember to include ${displayUnit(correct.unit)} in the final answer.`
      : undefined,
  };
}

export function displayUnit(unit: AnswerUnit): string {
  switch (unit) {
    case 'cm2':
      return 'cm²';
    case 'cm3':
      return 'cm³';
    case 'm2':
      return 'm²';
    case 'm3':
      return 'm³';
    case 'mm2':
      return 'mm²';
    case 'mm3':
      return 'mm³';
    case 'degrees':
      return '°';
    default:
      return '';
  }
}
