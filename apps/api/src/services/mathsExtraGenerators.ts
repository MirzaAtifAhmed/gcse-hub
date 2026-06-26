import type { GeneratedQuestion } from '@gcse-hub/types';

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function generateFractionOfAmountQuestion(year = 8): GeneratedQuestion {
  const denominator = randomInt(3, 12);
  const numerator = randomInt(1, denominator - 1);
  const multiplier = randomInt(4, 15);
  const amount = denominator * multiplier;
  const answer = numerator * multiplier;

  return {
    id: createId('gen-fraction-amount'),
    title: `Find ${numerator}/${denominator} of ${amount}`,
    questionText: `Find ${numerator}/${denominator} of ${amount}.`,
    topic: 'Fractions, Decimals and Percentages',
    skill: 'Fraction of an amount',
    type: 'worked',
    year,
    difficulty: 2,
    marks: 2,
    estimatedSeconds: 90,
    answer: String(answer),
    solution: {
      finalAnswer: String(answer),
      steps: [
        { order: 1, explanation: `Divide by the denominator.`, working: `${amount} ÷ ${denominator} = ${multiplier}` },
        { order: 2, explanation: `Multiply by the numerator.`, working: `${multiplier} × ${numerator} = ${answer}` },
      ],
      markScheme: [
        { marks: 1, description: 'Divides by the denominator correctly.' },
        { marks: 1, description: 'Multiplies by the numerator correctly.' },
      ],
      commonMistakes: ['Multiplying by the denominator instead of dividing first.'],
    },
    tags: ['fractions', 'amounts', `year-${year}`],
  };
}

export function generateAreaRectangleQuestion(year = 7): GeneratedQuestion {
  const length = randomInt(5, 20);
  const width = randomInt(3, 12);
  const answer = length * width;

  return {
    id: createId('gen-area-rectangle'),
    title: 'Area of a rectangle',
    questionText: `A rectangle has length ${length} cm and width ${width} cm. Find its area.`,
    topic: 'Area',
    skill: 'Area of rectangles',
    type: 'worked',
    year,
    difficulty: 1,
    marks: 2,
    estimatedSeconds: 60,
    answer: `${answer} cm²`,
    solution: {
      finalAnswer: `${answer} cm²`,
      steps: [
        { order: 1, explanation: 'Use area = length × width.', working: `${length} × ${width}` },
        { order: 2, explanation: 'Calculate the area.', working: `${length} × ${width} = ${answer} cm²` },
      ],
      markScheme: [
        { marks: 1, description: 'Uses correct area formula.' },
        { marks: 1, description: 'Calculates correct area with units.' },
      ],
    },
    tags: ['area', 'rectangle', `year-${year}`],
  };
}

export function generateAnglesOnLineQuestion(year = 8): GeneratedQuestion {
  const angle = randomInt(25, 150);
  const missing = 180 - angle;

  return {
    id: createId('gen-angles-line'),
    title: 'Angles on a straight line',
    questionText: `Two angles lie on a straight line. One angle is ${angle}°. Find the other angle.`,
    topic: 'Angles',
    skill: 'Angles on a straight line',
    type: 'worked',
    year,
    difficulty: 2,
    marks: 2,
    estimatedSeconds: 60,
    answer: `${missing}°`,
    solution: {
      finalAnswer: `${missing}°`,
      steps: [
        { order: 1, explanation: 'Angles on a straight line add to 180°.', working: `180° - ${angle}°` },
        { order: 2, explanation: 'Subtract to find the missing angle.', working: `${missing}°` },
      ],
      markScheme: [
        { marks: 1, description: 'Knows angles on a line add to 180°.' },
        { marks: 1, description: 'Correct missing angle.' },
      ],
    },
    tags: ['angles', `year-${year}`],
  };
}
