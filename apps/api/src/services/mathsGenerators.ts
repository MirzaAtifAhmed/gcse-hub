import type { GeneratedQuestion } from '@gcse-hub/types';
import {
  generateAnglesOnLineQuestion,
  generateAreaRectangleQuestion,
  generateCompoundAreaCostQuestion,
  generateFractionOfAmountQuestion,
  generatePercentageIncreaseQuestion,
} from './mathsExtraGenerators.js';
import { gcseExamStyleGenerators } from './gcseExamStyleGenerators.js';

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function gcd(a: number, b: number): number {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}

function simplifyFraction(numerator: number, denominator: number) {
  const divisor = gcd(numerator, denominator);
  return `${numerator / divisor}/${denominator / divisor}`;
}

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function difficultyForYear(year: number, base: number): 1 | 2 | 3 | 4 | 5 {
  return Math.max(1, Math.min(5, base + Math.max(0, year - 8))) as 1 | 2 | 3 | 4 | 5;
}

export function generateExpandingBracketQuestion(year = 8): GeneratedQuestion {
  const coefficient = randomInt(2, year >= 10 ? 12 : 9);
  const constant = randomInt(2, year >= 10 ? 20 : 12);
  const answer = `${coefficient}x + ${coefficient * constant}`;

  return {
    id: createId('gen-algebra-expand'),
    title: `Expand ${coefficient}(x + ${constant})`,
    questionText: year >= 9
      ? `Expand and simplify ${coefficient}(x + ${constant}). Then explain why both terms inside the bracket must be multiplied.`
      : `Expand and simplify: ${coefficient}(x + ${constant})`,
    topic: 'Algebra',
    skill: 'Expand single brackets',
    type: 'worked',
    year,
    difficulty: difficultyForYear(year, 3),
    marks: year >= 9 ? 3 : 2,
    estimatedSeconds: year >= 9 ? 150 : 90,
    answer,
    solution: {
      finalAnswer: answer,
      steps: [
        { order: 1, explanation: `Multiply ${coefficient} by each term inside the bracket.`, working: `${coefficient} × x = ${coefficient}x and ${coefficient} × ${constant} = ${coefficient * constant}` },
        { order: 2, explanation: 'Write the expanded expression.', working: `${coefficient}(x + ${constant}) = ${answer}` },
      ],
      markScheme: [
        { marks: 1, description: `Correctly multiplies ${coefficient} by x.` },
        { marks: 1, description: `Correctly multiplies ${coefficient} by ${constant}.` },
        ...(year >= 9 ? [{ marks: 1, description: 'Clear explanation of the distributive law.' }] : []),
      ],
      commonMistakes: [`Writing ${coefficient}x + ${constant} instead of multiplying both terms.`],
    },
    tags: ['algebra', 'expanding-brackets', `year-${year}`],
  };
}

export function generateRatioSharingQuestion(year = 8): GeneratedQuestion {
  const partA = randomInt(2, 6);
  const partB = randomInt(3, 9);
  const onePart = randomInt(5, year >= 10 ? 35 : 20);
  const total = (partA + partB) * onePart;
  const shareA = partA * onePart;
  const shareB = partB * onePart;

  return {
    id: createId('gen-ratio-share'),
    title: `Share £${total} in the ratio ${partA}:${partB}`,
    questionText: year >= 9
      ? `A charity event raises £${total}. The money is shared between two projects in the ratio ${partA}:${partB}. Work out how much each project receives.`
      : `Share £${total} in the ratio ${partA}:${partB}.`,
    topic: 'Ratio and Proportion',
    skill: 'Share in a ratio',
    type: 'worked',
    year,
    difficulty: difficultyForYear(year, 3),
    marks: 3,
    estimatedSeconds: 150,
    answer: `£${shareA} and £${shareB}`,
    diagram: { type: 'ratio-bar', data: { partA, partB, total } },
    solution: {
      finalAnswer: `£${shareA} and £${shareB}`,
      steps: [
        { order: 1, explanation: 'Add the parts of the ratio.', working: `${partA} + ${partB} = ${partA + partB} parts` },
        { order: 2, explanation: 'Find the value of one part.', working: `£${total} ÷ ${partA + partB} = £${onePart}` },
        { order: 3, explanation: 'Multiply each ratio part.', working: `${partA} parts = £${shareA} and ${partB} parts = £${shareB}` },
      ],
      markScheme: [
        { marks: 1, description: 'Adds ratio parts correctly.' },
        { marks: 1, description: 'Finds one part.' },
        { marks: 1, description: 'Finds both shares.' },
      ],
    },
    tags: ['ratio', 'real-world', `year-${year}`],
  };
}

export function generateProbabilityQuestion(year = 7): GeneratedQuestion {
  const outcomes = [
    { question: 'rolling an even number', favourable: 3, total: 6, examples: '2, 4, 6' },
    { question: 'rolling a number greater than 4', favourable: 2, total: 6, examples: '5, 6' },
    { question: 'rolling a multiple of 3', favourable: 2, total: 6, examples: '3, 6' },
  ];

  const selected = outcomes[randomInt(0, outcomes.length - 1)];
  const simplified = simplifyFraction(selected.favourable, selected.total);

  return {
    id: createId('gen-probability'),
    title: `Probability of ${selected.question}`,
    questionText: `A fair six-sided dice is rolled. What is the probability of ${selected.question}?`,
    topic: 'Probability',
    skill: 'Simple probability',
    type: year >= 8 ? 'multiple-choice' : 'short-answer',
    year,
    difficulty: difficultyForYear(year, 2),
    marks: 2,
    estimatedSeconds: 75,
    answer: simplified,
    options: year >= 8 ? [
      { id: 'a', label: simplified, value: simplified },
      { id: 'b', label: `${selected.favourable}/10`, value: `${selected.favourable}/10` },
      { id: 'c', label: `${selected.total}/${selected.favourable}`, value: `${selected.total}/${selected.favourable}` },
      { id: 'd', label: `${selected.total - selected.favourable}/${selected.total}`, value: `${selected.total - selected.favourable}/${selected.total}` },
    ] : undefined,
    solution: {
      finalAnswer: simplified,
      steps: [
        { order: 1, explanation: 'List the favourable outcomes.', working: selected.examples },
        { order: 2, explanation: 'Write favourable outcomes over total outcomes.', working: `${selected.favourable}/${selected.total} = ${simplified}` },
      ],
      markScheme: [
        { marks: 1, description: 'Identifies favourable outcomes.' },
        { marks: 1, description: 'Writes probability correctly.' },
      ],
    },
    tags: ['probability', 'mcq', `year-${year}`],
  };
}

export function generatePercentageQuestion(year = 8): GeneratedQuestion {
  const percentages = [10, 15, 20, 25, 30, 40, 50];
  const percentage = percentages[randomInt(0, percentages.length - 1)];
  const amount = randomInt(4, 30) * 10;
  const answerValue = (percentage / 100) * amount;

  return {
    id: createId('gen-percentages'),
    title: `Find ${percentage}% of ${amount}`,
    questionText: year >= 9
      ? `A class has ${amount} students across a year group. ${percentage}% attend revision club. How many students attend revision club?`
      : `Find ${percentage}% of ${amount}.`,
    topic: 'Fractions, Decimals and Percentages',
    skill: 'Find percentages of amounts',
    type: 'worked',
    year,
    difficulty: difficultyForYear(year, 2),
    marks: 2,
    estimatedSeconds: 90,
    answer: `${answerValue}`,
    solution: {
      finalAnswer: `${answerValue}`,
      steps: [
        { order: 1, explanation: 'Convert percentage to decimal.', working: `${percentage}% = ${percentage / 100}` },
        { order: 2, explanation: 'Multiply the amount.', working: `${amount} × ${percentage / 100} = ${answerValue}` },
      ],
      markScheme: [
        { marks: 1, description: 'Correct method.' },
        { marks: 1, description: 'Correct answer.' },
      ],
    },
    tags: ['percentages', `year-${year}`],
  };
}

export function generateLinearEquationQuestion(year = 9): GeneratedQuestion {
  const x = randomInt(2, 12);
  const a = randomInt(2, 7);
  const b = randomInt(3, 20);
  const rhs = a * x + b;

  return {
    id: createId('gen-linear-equation'),
    title: 'Solve a linear equation',
    questionText: `Solve ${a}x + ${b} = ${rhs}.`,
    topic: 'Algebra',
    skill: 'Solving linear equations',
    type: 'worked',
    year,
    difficulty: difficultyForYear(year, 3),
    marks: 3,
    estimatedSeconds: 180,
    answer: `x = ${x}`,
    solution: {
      finalAnswer: `x = ${x}`,
      steps: [
        { order: 1, explanation: `Subtract ${b} from both sides.`, working: `${a}x = ${rhs - b}` },
        { order: 2, explanation: `Divide both sides by ${a}.`, working: `x = ${x}` },
      ],
      markScheme: [
        { marks: 1, description: 'Correct inverse operation to remove constant.' },
        { marks: 1, description: 'Correct division step.' },
        { marks: 1, description: 'Correct final value of x.' },
      ],
    },
    tags: ['algebra', 'equations', `year-${year}`],
  };
}

export function generateMixedMathsQuestions(year = 8, count = 10): GeneratedQuestion[] {
  const easier = [
    () => generatePercentageQuestion(year),
    () => generateFractionOfAmountQuestion(year),
    () => generateAreaRectangleQuestion(year),
    () => generateAnglesOnLineQuestion(year),
    () => generateProbabilityQuestion(year),
  ];

  const middle = [
    () => generateExpandingBracketQuestion(year),
    () => generateRatioSharingQuestion(year),
    () => generatePercentageIncreaseQuestion(year),
    () => generateLinearEquationQuestion(year),
  ];

  const harder = [
    () => generateCompoundAreaCostQuestion(year),
    () => generateLinearEquationQuestion(year),
    () => generateRatioSharingQuestion(year),
    () => generatePercentageIncreaseQuestion(year),
    ...gcseExamStyleGenerators.map((generator) => () => generator(year)),
  ];

  return Array.from({ length: count }, (_, index) => {
    const progress = index / Math.max(1, count - 1);
    const pool = progress < 0.35 ? easier : progress < 0.75 ? middle : harder;
    return pool[index % pool.length]();
  });
}
