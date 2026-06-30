import type { GeneratedQuestion } from '@gcse-hub/types';

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function difficultyForYear(year: number, base: 1 | 2 | 3 | 4 | 5): 1 | 2 | 3 | 4 | 5 {
  return Math.max(1, Math.min(5, base + Math.max(0, year - 9))) as 1 | 2 | 3 | 4 | 5;
}

function money(value: number) {
  return `£${value.toFixed(2).replace(/\.00$/, '')}`;
}

export function generateSpeedDistanceTimeQuestion(year = 9): GeneratedQuestion {
  const speed = randomInt(35, year >= 10 ? 80 : 60);
  const time = randomInt(2, year >= 10 ? 5 : 4);
  const distance = speed * time;
  const answer = `${distance} km`;

  return {
    id: createId('gcse-speed-distance-time'),
    title: 'Speed, distance and time',
    questionText: `A coach travels at an average speed of ${speed} km/h for ${time} hours. Calculate the distance travelled.`,
    topic: 'Measures',
    skill: 'Use speed = distance ÷ time',
    type: 'worked',
    year,
    difficulty: difficultyForYear(year, 3),
    marks: 3,
    estimatedSeconds: 150,
    answer,
    calculatorAllowed: true,
    examStyle: true,
    solution: {
      finalAnswer: answer,
      steps: [
        { order: 1, explanation: 'Rearrange the speed formula.', working: 'distance = speed × time' },
        { order: 2, explanation: 'Substitute the values.', working: `${speed} × ${time}` },
        { order: 3, explanation: 'Calculate the distance and include units.', working: answer },
      ],
      markScheme: [
        { marks: 1, description: 'Uses a correct speed-distance-time relationship.' },
        { marks: 1, description: 'Substitutes the values correctly.' },
        { marks: 1, description: 'Gives the correct distance with units.' },
      ],
      commonMistakes: ['Dividing by time instead of multiplying when speed and time are given.'],
    },
    tags: ['measures', 'speed', 'real-world', `year-${year}`],
  };
}

export function generatePythagorasQuestion(year = 10): GeneratedQuestion {
  const triples = [
    [3, 4, 5],
    [5, 12, 13],
    [6, 8, 10],
    [8, 15, 17],
    [7, 24, 25],
  ];
  const [a, b, c] = triples[randomInt(0, triples.length - 1)];
  const answer = `${c} cm`;

  return {
    id: createId('gcse-pythagoras'),
    title: 'Pythagoras in context',
    questionText: `A right-angled triangle has shorter sides ${a} cm and ${b} cm. Calculate the length of the hypotenuse.`,
    topic: 'Geometry',
    skill: 'Pythagoras theorem',
    type: 'worked',
    year,
    difficulty: difficultyForYear(year, 4),
    marks: 4,
    estimatedSeconds: 240,
    answer,
    diagram: { type: 'triangle', data: { base: a, height: b, unit: 'cm' } },
    calculatorAllowed: true,
    examStyle: true,
    solution: {
      finalAnswer: answer,
      steps: [
        { order: 1, explanation: 'Use Pythagoras theorem for a right-angled triangle.', working: 'a² + b² = c²' },
        { order: 2, explanation: 'Substitute the two shorter sides.', working: `${a}² + ${b}² = c²` },
        { order: 3, explanation: 'Add the squares.', working: `${a * a} + ${b * b} = ${c * c}` },
        { order: 4, explanation: 'Square root to find the hypotenuse.', working: answer },
      ],
      markScheme: [
        { marks: 1, description: 'Recognises Pythagoras theorem is needed.' },
        { marks: 1, description: 'Squares both shorter sides correctly.' },
        { marks: 1, description: 'Adds and square roots correctly.' },
        { marks: 1, description: 'Gives the correct length with units.' },
      ],
      commonMistakes: ['Forgetting to square root at the final step.'],
    },
    tags: ['geometry', 'pythagoras', 'diagram', `year-${year}`],
  };
}

export function generateReversePercentageQuestion(year = 10): GeneratedQuestion {
  const original = randomInt(12, 40) * 10;
  const increase = [10, 20, 25][randomInt(0, 2)];
  const newValue = original * (1 + increase / 100);
  const answer = money(original);

  return {
    id: createId('gcse-reverse-percentage'),
    title: 'Reverse percentage',
    questionText: `After an increase of ${increase}%, a bike costs ${money(newValue)}. Work out the price before the increase.`,
    topic: 'Fractions, Decimals and Percentages',
    skill: 'Reverse percentages',
    type: 'worked',
    year,
    difficulty: difficultyForYear(year, 4),
    marks: 4,
    estimatedSeconds: 240,
    answer,
    calculatorAllowed: true,
    examStyle: true,
    solution: {
      finalAnswer: answer,
      steps: [
        { order: 1, explanation: `After a ${increase}% increase, the new price is ${100 + increase}% of the original.`, working: `${100 + increase}% = ${1 + increase / 100}` },
        { order: 2, explanation: 'Divide the new price by the multiplier.', working: `${money(newValue)} ÷ ${1 + increase / 100}` },
        { order: 3, explanation: 'Calculate the original price.', working: answer },
      ],
      markScheme: [
        { marks: 1, description: 'Identifies the correct percentage multiplier.' },
        { marks: 1, description: 'Uses division to reverse the percentage change.' },
        { marks: 1, description: 'Calculates the original value.' },
        { marks: 1, description: 'Gives a clear money answer.' },
      ],
      commonMistakes: [`Subtracting ${increase}% from the new price instead of reversing the multiplier.`],
    },
    tags: ['percentages', 'reverse-percentage', 'gcse', `year-${year}`],
  };
}

export function generateSimultaneousEquationsQuestion(year = 11): GeneratedQuestion {
  const x = randomInt(2, 8);
  const y = randomInt(1, 7);
  const firstTotal = x + y;
  const secondTotal = 2 * x + y;
  const answer = `x = ${x}, y = ${y}`;

  return {
    id: createId('gcse-simultaneous-equations'),
    title: 'Solve simultaneous equations',
    questionText: `Solve the simultaneous equations: x + y = ${firstTotal} and 2x + y = ${secondTotal}.`,
    topic: 'Algebra',
    skill: 'Simultaneous equations',
    type: 'worked',
    year,
    difficulty: 5,
    marks: 4,
    estimatedSeconds: 300,
    answer,
    examStyle: true,
    solution: {
      finalAnswer: answer,
      steps: [
        { order: 1, explanation: 'Subtract the first equation from the second.', working: `(2x + y) - (x + y) = ${secondTotal} - ${firstTotal}` },
        { order: 2, explanation: 'This gives the value of x.', working: `x = ${x}` },
        { order: 3, explanation: 'Substitute x into the first equation.', working: `${x} + y = ${firstTotal}` },
        { order: 4, explanation: 'Solve for y.', working: `y = ${y}` },
      ],
      markScheme: [
        { marks: 1, description: 'Uses a valid elimination or substitution method.' },
        { marks: 1, description: 'Finds x correctly.' },
        { marks: 1, description: 'Substitutes back correctly.' },
        { marks: 1, description: 'Finds y correctly.' },
      ],
      commonMistakes: ['Eliminating the wrong terms or not substituting back.'],
    },
    tags: ['algebra', 'simultaneous-equations', 'higher', `year-${year}`],
  };
}

export function generateProbabilityTreeQuestion(year = 10): GeneratedQuestion {
  const red = randomInt(2, 6);
  const blue = randomInt(2, 6);
  const total = red + blue;
  const numerator = red * (red - 1);
  const denominator = total * (total - 1);
  const answer = `${numerator}/${denominator}`;

  return {
    id: createId('gcse-probability-without-replacement'),
    title: 'Probability without replacement',
    questionText: `A bag contains ${red} red counters and ${blue} blue counters. Two counters are taken at random without replacement. Work out the probability that both counters are red.`,
    topic: 'Probability',
    skill: 'Combined probability without replacement',
    type: 'worked',
    year,
    difficulty: difficultyForYear(year, 4),
    marks: 4,
    estimatedSeconds: 270,
    answer,
    examStyle: true,
    solution: {
      finalAnswer: answer,
      steps: [
        { order: 1, explanation: 'Find the probability of red first.', working: `${red}/${total}` },
        { order: 2, explanation: 'After one red is removed, there is one fewer red and one fewer total counter.', working: `${red - 1}/${total - 1}` },
        { order: 3, explanation: 'Multiply the probabilities.', working: `${red}/${total} × ${red - 1}/${total - 1} = ${answer}` },
      ],
      markScheme: [
        { marks: 1, description: 'Correct first probability.' },
        { marks: 1, description: 'Correct second probability without replacement.' },
        { marks: 1, description: 'Multiplies probabilities.' },
        { marks: 1, description: 'Correct final probability.' },
      ],
      commonMistakes: ['Using replacement probabilities for the second draw.'],
    },
    tags: ['probability', 'tree-diagram', 'gcse', `year-${year}`],
  };
}

export function generateBoundsQuestion(year = 11): GeneratedQuestion {
  const rounded = randomInt(20, 80);
  const answer = `${rounded - 0.5} ≤ x < ${rounded + 0.5}`;

  return {
    id: createId('gcse-bounds'),
    title: 'Error intervals',
    questionText: `A length x is ${rounded} cm, correct to the nearest centimetre. Write down the error interval for x.`,
    topic: 'Number',
    skill: 'Bounds and error intervals',
    type: 'worked',
    year,
    difficulty: 5,
    marks: 3,
    estimatedSeconds: 210,
    answer,
    examStyle: true,
    solution: {
      finalAnswer: answer,
      steps: [
        { order: 1, explanation: 'Nearest centimetre means the maximum rounding error is 0.5 cm.', working: '±0.5 cm' },
        { order: 2, explanation: 'Find the lower and upper bounds.', working: `${rounded} - 0.5 = ${rounded - 0.5}, ${rounded} + 0.5 = ${rounded + 0.5}` },
        { order: 3, explanation: 'Use a strict upper bound because values at the upper bound round up.', working: answer },
      ],
      markScheme: [
        { marks: 1, description: 'Understands the half-unit rounding interval.' },
        { marks: 1, description: 'Finds the correct lower and upper bounds.' },
        { marks: 1, description: 'Writes the interval correctly.' },
      ],
      commonMistakes: ['Using ≤ for the upper bound instead of <.'],
    },
    tags: ['number', 'bounds', 'higher', `year-${year}`],
  };
}

export const gcseAdvancedGenerators = [
  generateSpeedDistanceTimeQuestion,
  generatePythagorasQuestion,
  generateReversePercentageQuestion,
  generateSimultaneousEquationsQuestion,
  generateProbabilityTreeQuestion,
  generateBoundsQuestion,
];
