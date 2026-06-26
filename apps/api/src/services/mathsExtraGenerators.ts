import type { GeneratedQuestion } from '@gcse-hub/types';

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function levelForYear(year: number, base: number): 1 | 2 | 3 | 4 | 5 {
  return Math.max(1, Math.min(5, base + Math.max(0, year - 8))) as 1 | 2 | 3 | 4 | 5;
}

export function generateFractionOfAmountQuestion(year = 8): GeneratedQuestion {
  const denominator = randomInt(3, 12);
  const numerator = randomInt(1, denominator - 1);
  const multiplier = randomInt(year >= 10 ? 8 : 4, year >= 10 ? 24 : 15);
  const amount = denominator * multiplier;
  const answer = numerator * multiplier;

  return {
    id: createId('gen-fraction-amount'),
    title: `Find ${numerator}/${denominator} of ${amount}`,
    questionText: year >= 9
      ? `A school buys ${amount} revision cards. ${numerator}/${denominator} of them are used in a maths club. How many cards are used?`
      : `Find ${numerator}/${denominator} of ${amount}.`,
    topic: 'Fractions, Decimals and Percentages',
    skill: 'Fraction of an amount',
    type: 'worked',
    year,
    difficulty: levelForYear(year, 2),
    marks: year >= 9 ? 3 : 2,
    estimatedSeconds: year >= 9 ? 150 : 90,
    answer: String(answer),
    solution: {
      finalAnswer: String(answer),
      steps: [
        { order: 1, explanation: 'Divide by the denominator.', working: `${amount} ÷ ${denominator} = ${multiplier}` },
        { order: 2, explanation: 'Multiply by the numerator.', working: `${multiplier} × ${numerator} = ${answer}` },
      ],
      markScheme: [
        { marks: 1, description: 'Divides by the denominator correctly.' },
        { marks: 1, description: 'Multiplies by the numerator correctly.' },
        ...(year >= 9 ? [{ marks: 1, description: 'Interprets the context correctly.' }] : []),
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
    questionText: year >= 9
      ? `A notice board is ${length} cm long and ${width} cm wide. A border of 1 cm is added around the outside. Find the area of the original notice board.`
      : `A rectangle has length ${length} cm and width ${width} cm. Find its area.`,
    topic: 'Area',
    skill: 'Area of rectangles',
    type: 'worked',
    year,
    difficulty: levelForYear(year, 1),
    marks: 2,
    estimatedSeconds: 75,
    answer: `${answer} cm²`,
    diagram: { type: 'rectangle', data: { length, width, unit: 'cm' } },
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
    questionText: year >= 9
      ? `Two adjacent angles lie on a straight line. One angle is ${angle}°. Find the other angle and explain which angle fact you used.`
      : `Two angles lie on a straight line. One angle is ${angle}°. Find the other angle.`,
    topic: 'Angles',
    skill: 'Angles on a straight line',
    type: 'worked',
    year,
    difficulty: levelForYear(year, 2),
    marks: year >= 9 ? 3 : 2,
    estimatedSeconds: year >= 9 ? 120 : 60,
    answer: `${missing}°`,
    diagram: { type: 'angle-line', data: { knownAngle: angle, missingAngle: missing } },
    solution: {
      finalAnswer: `${missing}°`,
      steps: [
        { order: 1, explanation: 'Angles on a straight line add to 180°.', working: `180° - ${angle}°` },
        { order: 2, explanation: 'Subtract to find the missing angle.', working: `${missing}°` },
      ],
      markScheme: [
        { marks: 1, description: 'Knows angles on a line add to 180°.' },
        { marks: 1, description: 'Correct missing angle.' },
        ...(year >= 9 ? [{ marks: 1, description: 'Gives a clear angle-fact explanation.' }] : []),
      ],
    },
    tags: ['angles', `year-${year}`],
  };
}

export function generatePercentageIncreaseQuestion(year = 9): GeneratedQuestion {
  const price = randomInt(12, 80) * 5;
  const percentage = [5, 10, 15, 20, 25][randomInt(0, 4)];
  const answer = price + (price * percentage) / 100;

  return {
    id: createId('gen-percent-increase'),
    title: 'Percentage increase in context',
    questionText: `A bike helmet costs £${price}. The price increases by ${percentage}%. Work out the new price.`,
    topic: 'Fractions, Decimals and Percentages',
    skill: 'Percentage increase',
    type: 'worked',
    year,
    difficulty: levelForYear(year, 3),
    marks: 3,
    estimatedSeconds: 150,
    answer: `£${answer}`,
    solution: {
      finalAnswer: `£${answer}`,
      steps: [
        { order: 1, explanation: `Find ${percentage}% of £${price}.`, working: `${percentage}% × ${price} = ${(price * percentage) / 100}` },
        { order: 2, explanation: 'Add the increase to the original price.', working: `${price} + ${(price * percentage) / 100} = ${answer}` },
      ],
      markScheme: [
        { marks: 1, description: 'Finds the percentage increase.' },
        { marks: 1, description: 'Adds the increase to the original amount.' },
        { marks: 1, description: 'Gives the correct money answer.' },
      ],
    },
    tags: ['percentages', 'real-world', `year-${year}`],
  };
}

export function generateCompoundAreaCostQuestion(year = 10): GeneratedQuestion {
  const length = randomInt(10, 24);
  const width = randomInt(6, 15);
  const path = 1;
  const cost = randomInt(10, 28);
  const outerArea = (length + 2 * path) * (width + 2 * path);
  const innerArea = length * width;
  const pavingArea = outerArea - innerArea;
  const total = pavingArea * cost;

  return {
    id: createId('gen-compound-area-cost'),
    title: 'Compound area and cost',
    questionText: `A rectangular garden is ${length} m by ${width} m. A path 1 m wide is built all around the garden. Paving costs £${cost} per m². Calculate the total cost of paving the path.`,
    topic: 'Area',
    skill: 'Compound area problem solving',
    type: 'worked',
    year,
    difficulty: levelForYear(year, 4),
    marks: 5,
    estimatedSeconds: 360,
    answer: `£${total}`,
    diagram: { type: 'rectangle', data: { length, width, border: path, unit: 'm' } },
    calculatorAllowed: true,
    examStyle: true,
    solution: {
      finalAnswer: `£${total}`,
      steps: [
        { order: 1, explanation: 'Find the outside dimensions including the path.', working: `${length + 2} m by ${width + 2} m` },
        { order: 2, explanation: 'Find the outside area.', working: `${length + 2} × ${width + 2} = ${outerArea} m²` },
        { order: 3, explanation: 'Find the garden area.', working: `${length} × ${width} = ${innerArea} m²` },
        { order: 4, explanation: 'Subtract to find the path area.', working: `${outerArea} - ${innerArea} = ${pavingArea} m²` },
        { order: 5, explanation: 'Multiply by the cost per square metre.', working: `${pavingArea} × £${cost} = £${total}` },
      ],
      markScheme: [
        { marks: 1, description: 'Finds outside dimensions.' },
        { marks: 1, description: 'Finds outside area.' },
        { marks: 1, description: 'Finds original rectangle area.' },
        { marks: 1, description: 'Finds path area.' },
        { marks: 1, description: 'Calculates total cost.' },
      ],
      commonMistakes: ['Adding 1 m only once instead of to both sides of each dimension.'],
    },
    tags: ['area', 'compound-shapes', 'cost', `year-${year}`],
  };
}
