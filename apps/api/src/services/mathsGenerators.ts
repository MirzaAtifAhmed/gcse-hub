import type { GeneratedQuestion } from '@gcse-hub/types';

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

export function generateExpandingBracketQuestion(year = 8): GeneratedQuestion {
  const coefficient = randomInt(2, 9);
  const constant = randomInt(2, 12);
  const answer = `${coefficient}x + ${coefficient * constant}`;

  return {
    id: createId('gen-algebra-expand'),
    title: `Expand ${coefficient}(x + ${constant})`,
    questionText: `Expand and simplify: ${coefficient}(x + ${constant})`,
    topic: 'Algebra',
    skill: 'Expand single brackets',
    type: 'worked',
    year,
    difficulty: 3,
    marks: 2,
    estimatedSeconds: 90,
    answer,
    solution: {
      finalAnswer: answer,
      steps: [
        {
          order: 1,
          explanation: `Multiply ${coefficient} by each term inside the bracket.`,
          working: `${coefficient} × x = ${coefficient}x and ${coefficient} × ${constant} = ${
            coefficient * constant
          }`,
        },
        {
          order: 2,
          explanation: 'Write the expanded expression.',
          working: `${coefficient}(x + ${constant}) = ${answer}`,
        },
      ],
      markScheme: [
        { marks: 1, description: `Correctly multiplies ${coefficient} by x.` },
        {
          marks: 1,
          description: `Correctly multiplies ${coefficient} by ${constant} and gives ${answer}.`,
        },
      ],
      commonMistakes: [
        `Writing ${coefficient}x + ${constant} instead of multiplying both terms by ${coefficient}.`,
      ],
    },
    tags: ['algebra', 'expanding-brackets', `year-${year}`],
  };
}

export function generateRatioSharingQuestion(year = 8): GeneratedQuestion {
  const partA = randomInt(2, 6);
  const partB = randomInt(3, 9);
  const onePart = randomInt(5, 20);
  const total = (partA + partB) * onePart;
  const shareA = partA * onePart;
  const shareB = partB * onePart;

  return {
    id: createId('gen-ratio-share'),
    title: `Share £${total} in the ratio ${partA}:${partB}`,
    questionText: `Share £${total} in the ratio ${partA}:${partB}.`,
    topic: 'Ratio and Proportion',
    skill: 'Share in a ratio',
    type: 'worked',
    year,
    difficulty: 3,
    marks: 3,
    estimatedSeconds: 120,
    answer: `£${shareA} and £${shareB}`,
    solution: {
      finalAnswer: `£${shareA} and £${shareB}`,
      steps: [
        {
          order: 1,
          explanation: 'Add the parts of the ratio.',
          working: `${partA} + ${partB} = ${partA + partB} parts`,
        },
        {
          order: 2,
          explanation: 'Find the value of one part.',
          working: `£${total} ÷ ${partA + partB} = £${onePart}`,
        },
        {
          order: 3,
          explanation: 'Multiply each ratio part by the value of one part.',
          working: `${partA} parts = £${shareA} and ${partB} parts = £${shareB}`,
        },
      ],
      markScheme: [
        { marks: 1, description: 'Adds ratio parts correctly.' },
        { marks: 1, description: 'Finds the value of one part.' },
        { marks: 1, description: 'Finds both final shares correctly.' },
      ],
      commonMistakes: [
        'Dividing by 2 because there are two people instead of using total ratio parts.',
      ],
    },
    tags: ['ratio', 'sharing-ratio', `year-${year}`],
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
    type: 'short-answer',
    year,
    difficulty: 2,
    marks: 2,
    estimatedSeconds: 75,
    answer: simplified,
    solution: {
      finalAnswer: simplified,
      steps: [
        {
          order: 1,
          explanation: 'List the favourable outcomes.',
          working: selected.examples,
        },
        {
          order: 2,
          explanation: 'Write favourable outcomes over total possible outcomes and simplify.',
          working: `${selected.favourable}/${selected.total} = ${simplified}`,
        },
      ],
      markScheme: [
        { marks: 1, description: 'Identifies the favourable outcomes correctly.' },
        { marks: 1, description: 'Writes the probability correctly as a fraction.' },
      ],
      commonMistakes: ['Giving the number of favourable outcomes instead of a probability.'],
    },
    tags: ['probability', 'dice', `year-${year}`],
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
    questionText: `Find ${percentage}% of ${amount}.`,
    topic: 'Fractions, Decimals and Percentages',
    skill: 'Find percentages of amounts',
    type: 'worked',
    year,
    difficulty: 2,
    marks: 2,
    estimatedSeconds: 90,
    answer: `${answerValue}`,
    solution: {
      finalAnswer: `${answerValue}`,
      steps: [
        {
          order: 1,
          explanation: 'Convert the percentage to a decimal.',
          working: `${percentage}% = ${percentage / 100}`,
        },
        {
          order: 2,
          explanation: 'Multiply the amount by the decimal.',
          working: `${amount} × ${percentage / 100} = ${answerValue}`,
        },
      ],
      markScheme: [
        { marks: 1, description: 'Correct method to convert or calculate the percentage.' },
        { marks: 1, description: 'Correct final answer.' },
      ],
      commonMistakes: ['Dividing by the percentage instead of finding that percentage of the amount.'],
    },
    tags: ['percentages', 'fdp', `year-${year}`],
  };
}

export function generateMixedMathsQuestions(year = 8, count = 10): GeneratedQuestion[] {
  const generators = [
    () => generateExpandingBracketQuestion(year),
    () => generateRatioSharingQuestion(year),
    () => generateProbabilityQuestion(year),
    () => generatePercentageQuestion(year),
  ];

  return Array.from({ length: count }, (_, index) => generators[index % generators.length]());
}
