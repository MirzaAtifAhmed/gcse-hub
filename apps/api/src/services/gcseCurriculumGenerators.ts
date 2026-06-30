import type { GeneratedQuestion } from '@gcse-hub/types';

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function clampDifficulty(value: number): 1 | 2 | 3 | 4 | 5 {
  return Math.max(1, Math.min(5, value)) as 1 | 2 | 3 | 4 | 5;
}

function difficultyForYear(year: number, base: number): 1 | 2 | 3 | 4 | 5 {
  return clampDifficulty(base + Math.max(0, year - 8));
}

function commonQuestionFields(year: number, prefix: string, topic: string, skill: string) {
  return {
    id: createId(prefix),
    topic,
    skill,
    year,
    tags: [topic.toLowerCase(), skill.toLowerCase().replace(/\s+/g, '-'), `year-${year}`, 'phase-028-curriculum'],
  };
}

export function generateStandardFormQuestion(year = 9): GeneratedQuestion {
  const coefficient = randomInt(12, 98) / 10;
  const power = randomInt(3, 7);
  const answer = `${coefficient} × 10^${power}`;
  return {
    ...commonQuestionFields(year, 'curr-standard-form', 'Number', 'Standard form'),
    title: 'Write a number in standard form',
    questionText: `Write ${coefficient * 10 ** power} in standard form.`,
    type: 'short-answer',
    difficulty: difficultyForYear(year, 3),
    marks: 2,
    estimatedSeconds: 120,
    answer,
    examStyle: true,
    solution: {
      finalAnswer: answer,
      steps: [
        { order: 1, explanation: 'Move the decimal point so the first number is between 1 and 10.', working: String(coefficient) },
        { order: 2, explanation: 'Count how many places the decimal point moved.', working: `10^${power}` },
      ],
      markScheme: [
        { marks: 1, description: 'Writes a number between 1 and 10.' },
        { marks: 1, description: 'Uses the correct power of 10.' },
      ],
      commonMistakes: ['Using a first number bigger than 10.'],
    },
  };
}

export function generateIndexLawsQuestion(year = 9): GeneratedQuestion {
  const base = randomInt(2, 6);
  const a = randomInt(2, 6);
  const b = randomInt(2, 5);
  const answer = `${base}^${a + b}`;
  return {
    ...commonQuestionFields(year, 'curr-index-laws', 'Number', 'Index laws'),
    title: 'Simplify using index laws',
    questionText: `Simplify ${base}^${a} × ${base}^${b}.`,
    type: 'worked',
    difficulty: difficultyForYear(year, 3),
    marks: 2,
    estimatedSeconds: 120,
    answer,
    solution: {
      finalAnswer: answer,
      steps: [
        { order: 1, explanation: 'When multiplying powers with the same base, add the powers.', working: `${a} + ${b} = ${a + b}` },
        { order: 2, explanation: 'Keep the same base.', working: answer },
      ],
      markScheme: [
        { marks: 1, description: 'Adds the powers.' },
        { marks: 1, description: 'Gives the simplified power.' },
      ],
      commonMistakes: ['Multiplying the powers instead of adding them.'],
    },
  };
}

export function generateSequenceNthTermQuestion(year = 8): GeneratedQuestion {
  const step = randomInt(2, 9);
  const start = randomInt(1, 12);
  const nth = `${step}n ${start - step >= 0 ? '+' : '-'} ${Math.abs(start - step)}`;
  return {
    ...commonQuestionFields(year, 'curr-nth-term', 'Algebra', 'Linear sequences'),
    title: 'Find the nth term',
    questionText: `The first four terms of a sequence are ${start}, ${start + step}, ${start + 2 * step}, ${start + 3 * step}. Find an expression for the nth term.`,
    type: 'worked',
    difficulty: difficultyForYear(year, 3),
    marks: 3,
    estimatedSeconds: 180,
    answer: nth,
    examStyle: true,
    solution: {
      finalAnswer: nth,
      steps: [
        { order: 1, explanation: 'Find the common difference.', working: `${step}` },
        { order: 2, explanation: 'Start with the coefficient of n.', working: `${step}n` },
        { order: 3, explanation: 'Adjust so n = 1 gives the first term.', working: nth },
      ],
      markScheme: [
        { marks: 1, description: 'Finds the common difference.' },
        { marks: 1, description: 'Uses the correct n coefficient.' },
        { marks: 1, description: 'Finds the correct constant term.' },
      ],
    },
    tags: ['algebra', 'sequences', 'nth-term', `year-${year}`, 'phase-028-curriculum'],
  };
}

export function generateFactorisingQuadraticQuestion(year = 10): GeneratedQuestion {
  const a = randomInt(2, 8);
  const b = randomInt(2, 8);
  const answer = `(x + ${a})(x + ${b})`;
  return {
    ...commonQuestionFields(year, 'curr-factorise-quadratic', 'Algebra', 'Factorising quadratics'),
    title: 'Factorise a quadratic',
    questionText: `Factorise x² + ${a + b}x + ${a * b}.`,
    type: 'worked',
    difficulty: difficultyForYear(year, 4),
    marks: 3,
    estimatedSeconds: 210,
    answer,
    examStyle: true,
    solution: {
      finalAnswer: answer,
      steps: [
        { order: 1, explanation: 'Find two numbers that multiply to the constant term.', working: `${a} × ${b} = ${a * b}` },
        { order: 2, explanation: 'Check they add to the coefficient of x.', working: `${a} + ${b} = ${a + b}` },
        { order: 3, explanation: 'Write the brackets.', working: answer },
      ],
      markScheme: [
        { marks: 1, description: 'Finds factor pair.' },
        { marks: 1, description: 'Checks the sum.' },
        { marks: 1, description: 'Writes correct brackets.' },
      ],
      commonMistakes: ['Only checking multiplication and forgetting the sum.'],
    },
    tags: ['algebra', 'quadratics', 'factorising', 'higher', `year-${year}`, 'phase-028-curriculum'],
  };
}

export function generateQuadraticFormulaMCQ(year = 11): GeneratedQuestion {
  const roots = [randomInt(1, 5), randomInt(6, 9)];
  const sum = roots[0] + roots[1];
  const product = roots[0] * roots[1];
  const correct = `x = ${roots[0]} or x = ${roots[1]}`;
  return {
    ...commonQuestionFields(year, 'curr-quadratic-mcq', 'Algebra', 'Solving quadratics'),
    title: 'Solve a quadratic equation',
    questionText: `Solve x² - ${sum}x + ${product} = 0.`,
    type: 'multiple-choice',
    difficulty: 5,
    marks: 2,
    estimatedSeconds: 150,
    answer: correct,
    options: [
      { id: 'A', label: correct, value: correct },
      { id: 'B', label: `x = ${roots[0] + 1} or x = ${roots[1] - 1}`, value: `x = ${roots[0] + 1} or x = ${roots[1] - 1}` },
      { id: 'C', label: `x = -${roots[0]} or x = -${roots[1]}`, value: `x = -${roots[0]} or x = -${roots[1]}` },
      { id: 'D', label: `x = ${sum} or x = ${product}`, value: `x = ${sum} or x = ${product}` },
    ],
    examStyle: true,
    solution: {
      finalAnswer: correct,
      steps: [
        { order: 1, explanation: 'Find two numbers that multiply to the constant term and add to the middle coefficient.', working: `${roots[0]} × ${roots[1]} = ${product}, ${roots[0]} + ${roots[1]} = ${sum}` },
        { order: 2, explanation: 'Factorise and solve each bracket.', working: `(x - ${roots[0]})(x - ${roots[1]}) = 0` },
      ],
      markScheme: [{ marks: 2, description: 'Selects the correct pair of roots.' }],
    },
    tags: ['algebra', 'quadratics', 'multiple-choice', 'higher', `year-${year}`, 'phase-028-curriculum'],
  };
}

export function generateDirectProportionQuestion(year = 9): GeneratedQuestion {
  const unit = randomInt(3, 8);
  const amount = randomInt(4, 9);
  const answer = `£${unit * amount}`;
  return {
    ...commonQuestionFields(year, 'curr-direct-proportion', 'Ratio and Proportion', 'Direct proportion'),
    title: 'Direct proportion in context',
    questionText: `${amount} identical notebooks cost £${unit * amount}. How much do 1 notebook and ${amount + 5} notebooks cost?`,
    type: 'worked',
    difficulty: difficultyForYear(year, 3),
    marks: 4,
    estimatedSeconds: 240,
    answer: `£${unit} and £${unit * (amount + 5)}`,
    examStyle: true,
    solution: {
      finalAnswer: `£${unit} and £${unit * (amount + 5)}`,
      steps: [
        { order: 1, explanation: 'Find the cost of one notebook.', working: `£${unit * amount} ÷ ${amount} = £${unit}` },
        { order: 2, explanation: 'Multiply by the new number of notebooks.', working: `£${unit} × ${amount + 5} = £${unit * (amount + 5)}` },
      ],
      markScheme: [
        { marks: 2, description: 'Finds the unit cost.' },
        { marks: 2, description: 'Uses the unit cost for the new amount.' },
      ],
    },
    tags: ['ratio', 'proportion', 'direct-proportion', 'real-world', `year-${year}`, 'phase-028-curriculum'],
  };
}

export function generateInverseProportionQuestion(year = 10): GeneratedQuestion {
  const workers = randomInt(3, 6);
  const days = randomInt(6, 12);
  const newWorkers = workers * 2;
  const answer = `${days / 2} days`;
  return {
    ...commonQuestionFields(year, 'curr-inverse-proportion', 'Ratio and Proportion', 'Inverse proportion'),
    title: 'Inverse proportion',
    questionText: `${workers} workers take ${days} days to complete a job. Assuming they work at the same rate, how long would ${newWorkers} workers take?`,
    type: 'worked',
    difficulty: difficultyForYear(year, 4),
    marks: 3,
    estimatedSeconds: 210,
    answer,
    examStyle: true,
    solution: {
      finalAnswer: answer,
      steps: [
        { order: 1, explanation: 'Doubling the number of workers halves the time.', working: `${workers} workers → ${newWorkers} workers` },
        { order: 2, explanation: 'Halve the number of days.', working: `${days} ÷ 2 = ${days / 2}` },
      ],
      markScheme: [
        { marks: 1, description: 'Recognises inverse proportion.' },
        { marks: 1, description: 'Uses the correct scale factor.' },
        { marks: 1, description: 'Finds the correct time.' },
      ],
    },
    tags: ['ratio', 'proportion', 'inverse-proportion', 'real-world', `year-${year}`, 'phase-028-curriculum'],
  };
}

export function generateBearingQuestion(year = 10): GeneratedQuestion {
  const bearing = randomInt(4, 30) * 10;
  const answer = `${String(bearing).padStart(3, '0')}°`;
  return {
    ...commonQuestionFields(year, 'curr-bearings', 'Geometry', 'Bearings'),
    title: 'Bearings',
    questionText: `A ship travels from point A on a bearing of ${answer}. State the angle measured clockwise from north.`,
    type: 'worked',
    difficulty: difficultyForYear(year, 4),
    marks: 2,
    estimatedSeconds: 120,
    answer,
    diagram: { type: 'coordinate-grid', data: { bearing, label: 'A', north: true } },
    examStyle: true,
    solution: {
      finalAnswer: answer,
      steps: [
        { order: 1, explanation: 'Bearings are measured clockwise from north.' },
        { order: 2, explanation: 'Bearings are written using three digits.', working: answer },
      ],
      markScheme: [
        { marks: 1, description: 'Measures clockwise from north.' },
        { marks: 1, description: 'Writes the bearing using three digits.' },
      ],
    },
    tags: ['geometry', 'bearings', 'diagram', `year-${year}`, 'phase-028-curriculum'],
  };
}

export function generateCircleAreaQuestion(year = 9): GeneratedQuestion {
  const radius = randomInt(3, 12);
  const answer = `${(Math.PI * radius * radius).toFixed(1)} cm²`;
  return {
    ...commonQuestionFields(year, 'curr-circle-area', 'Geometry', 'Circle area'),
    title: 'Area of a circle',
    questionText: `A circle has radius ${radius} cm. Calculate its area to 1 decimal place.`,
    type: 'worked',
    difficulty: difficultyForYear(year, 3),
    marks: 3,
    estimatedSeconds: 180,
    answer,
    diagram: { type: 'circle', data: { radius, unit: 'cm' } },
    calculatorAllowed: true,
    examStyle: true,
    solution: {
      finalAnswer: answer,
      steps: [
        { order: 1, explanation: 'Use the area formula for a circle.', working: 'A = πr²' },
        { order: 2, explanation: 'Substitute the radius.', working: `A = π × ${radius}²` },
        { order: 3, explanation: 'Calculate and round to 1 decimal place.', working: answer },
      ],
      markScheme: [
        { marks: 1, description: 'Uses A = πr².' },
        { marks: 1, description: 'Substitutes radius correctly.' },
        { marks: 1, description: 'Calculates and rounds correctly.' },
      ],
    },
    tags: ['geometry', 'circle', 'area', 'diagram', `year-${year}`, 'phase-028-curriculum'],
  };
}

export function generateVolumeCylinderQuestion(year = 10): GeneratedQuestion {
  const radius = randomInt(2, 8);
  const height = randomInt(5, 15);
  const answer = `${(Math.PI * radius * radius * height).toFixed(1)} cm³`;
  return {
    ...commonQuestionFields(year, 'curr-cylinder-volume', 'Geometry', 'Volume of cylinders'),
    title: 'Volume of a cylinder',
    questionText: `A cylinder has radius ${radius} cm and height ${height} cm. Calculate its volume to 1 decimal place.`,
    type: 'worked',
    difficulty: difficultyForYear(year, 4),
    marks: 4,
    estimatedSeconds: 240,
    answer,
    calculatorAllowed: true,
    examStyle: true,
    solution: {
      finalAnswer: answer,
      steps: [
        { order: 1, explanation: 'Use the volume formula for a cylinder.', working: 'V = πr²h' },
        { order: 2, explanation: 'Substitute the radius and height.', working: `V = π × ${radius}² × ${height}` },
        { order: 3, explanation: 'Calculate and include cubic units.', working: answer },
      ],
      markScheme: [
        { marks: 1, description: 'Uses V = πr²h.' },
        { marks: 1, description: 'Substitutes values correctly.' },
        { marks: 1, description: 'Calculates accurately.' },
        { marks: 1, description: 'Gives correct units.' },
      ],
    },
    tags: ['geometry', 'volume', 'cylinder', `year-${year}`, 'phase-028-curriculum'],
  };
}

export function generateAnglePolygonQuestion(year = 9): GeneratedQuestion {
  const sides = randomInt(5, 10);
  const sum = (sides - 2) * 180;
  const answer = `${sum}°`;
  return {
    ...commonQuestionFields(year, 'curr-polygon-angles', 'Geometry', 'Angles in polygons'),
    title: 'Interior angles of a polygon',
    questionText: `Find the sum of the interior angles of a ${sides}-sided polygon.`,
    type: 'worked',
    difficulty: difficultyForYear(year, 3),
    marks: 3,
    estimatedSeconds: 180,
    answer,
    examStyle: true,
    solution: {
      finalAnswer: answer,
      steps: [
        { order: 1, explanation: 'Use the formula for the sum of interior angles.', working: '(n - 2) × 180°' },
        { order: 2, explanation: 'Substitute the number of sides.', working: `(${sides} - 2) × 180°` },
        { order: 3, explanation: 'Calculate the sum.', working: answer },
      ],
      markScheme: [
        { marks: 1, description: 'Uses correct formula.' },
        { marks: 1, description: 'Substitutes n correctly.' },
        { marks: 1, description: 'Calculates correct angle sum.' },
      ],
    },
    tags: ['geometry', 'angles', 'polygons', `year-${year}`, 'phase-028-curriculum'],
  };
}

export function generateMeanFromTableQuestion(year = 8): GeneratedQuestion {
  const values = [randomInt(2, 6), randomInt(7, 12), randomInt(13, 18)];
  const frequencies = [randomInt(1, 4), randomInt(2, 5), randomInt(1, 4)];
  const total = values.reduce((sum, value, index) => sum + value * frequencies[index], 0);
  const count = frequencies.reduce((sum, value) => sum + value, 0);
  const answer = `${(total / count).toFixed(1)}`;
  return {
    ...commonQuestionFields(year, 'curr-mean-table', 'Statistics', 'Mean from a frequency table'),
    title: 'Mean from a frequency table',
    questionText: `Values ${values.join(', ')} have frequencies ${frequencies.join(', ')}. Calculate the mean to 1 decimal place.`,
    type: 'worked',
    difficulty: difficultyForYear(year, 3),
    marks: 4,
    estimatedSeconds: 240,
    answer,
    diagram: { type: 'bar-chart', data: { labels: values, values: frequencies } },
    examStyle: true,
    solution: {
      finalAnswer: answer,
      steps: [
        { order: 1, explanation: 'Multiply each value by its frequency.', working: values.map((value, index) => `${value}×${frequencies[index]}`).join(' + ') },
        { order: 2, explanation: 'Add the products and divide by the total frequency.', working: `${total} ÷ ${count}` },
        { order: 3, explanation: 'Round to 1 decimal place.', working: answer },
      ],
      markScheme: [
        { marks: 1, description: 'Uses value × frequency.' },
        { marks: 1, description: 'Finds total of products.' },
        { marks: 1, description: 'Divides by total frequency.' },
        { marks: 1, description: 'Rounds correctly.' },
      ],
    },
    tags: ['statistics', 'averages', 'mean', 'frequency-table', 'diagram', `year-${year}`, 'phase-028-curriculum'],
  };
}

export function generateScatterGraphQuestion(year = 9): GeneratedQuestion {
  const answer = 'positive correlation';
  return {
    ...commonQuestionFields(year, 'curr-scatter-graph', 'Statistics', 'Scatter graphs'),
    title: 'Interpret a scatter graph',
    questionText: 'A scatter graph shows that as revision time increases, test score generally increases. Describe the correlation.',
    type: 'multiple-choice',
    difficulty: difficultyForYear(year, 2),
    marks: 1,
    estimatedSeconds: 60,
    answer,
    options: [
      { id: 'A', label: 'positive correlation', value: 'positive correlation' },
      { id: 'B', label: 'negative correlation', value: 'negative correlation' },
      { id: 'C', label: 'no correlation', value: 'no correlation' },
    ],
    diagram: { type: 'coordinate-grid', data: { trend: 'positive' } },
    examStyle: true,
    solution: {
      finalAnswer: answer,
      steps: [{ order: 1, explanation: 'Both quantities increase together, so the relationship is positive correlation.' }],
      markScheme: [{ marks: 1, description: 'Identifies positive correlation.' }],
    },
    tags: ['statistics', 'scatter-graphs', 'multiple-choice', 'diagram', `year-${year}`, 'phase-028-curriculum'],
  };
}

export function generateVennProbabilityQuestion(year = 10): GeneratedQuestion {
  const football = randomInt(8, 16);
  const tennis = randomInt(6, 12);
  const both = randomInt(2, Math.min(football, tennis) - 1);
  const total = randomInt(25, 40);
  const union = football + tennis - both;
  const answer = `${union}/${total}`;
  return {
    ...commonQuestionFields(year, 'curr-venn-probability', 'Probability', 'Venn diagrams'),
    title: 'Probability from a Venn diagram',
    questionText: `In a class of ${total}, ${football} students play football, ${tennis} play tennis and ${both} play both. One student is chosen at random. Find the probability they play football or tennis.`,
    type: 'worked',
    difficulty: difficultyForYear(year, 4),
    marks: 4,
    estimatedSeconds: 240,
    answer,
    examStyle: true,
    solution: {
      finalAnswer: answer,
      steps: [
        { order: 1, explanation: 'For “or”, add both groups then subtract the overlap once.', working: `${football} + ${tennis} - ${both} = ${union}` },
        { order: 2, explanation: 'Write the favourable outcomes over the total.', working: answer },
      ],
      markScheme: [
        { marks: 1, description: 'Recognises the overlap.' },
        { marks: 1, description: 'Subtracts the overlap once.' },
        { marks: 1, description: 'Writes a probability.' },
        { marks: 1, description: 'Gives the correct probability.' },
      ],
    },
    tags: ['probability', 'venn-diagrams', 'gcse', `year-${year}`, 'phase-028-curriculum'],
  };
}

export function generateTransformationQuestion(year = 8): GeneratedQuestion {
  const dx = randomInt(-5, 5) || 3;
  const dy = randomInt(-5, 5) || -2;
  const answer = `translation by vector (${dx}, ${dy})`;
  return {
    ...commonQuestionFields(year, 'curr-transformations', 'Geometry', 'Transformations'),
    title: 'Describe a translation',
    questionText: `Shape A is moved ${Math.abs(dx)} squares ${dx > 0 ? 'right' : 'left'} and ${Math.abs(dy)} squares ${dy > 0 ? 'up' : 'down'}. Describe the transformation.`,
    type: 'worked',
    difficulty: difficultyForYear(year, 2),
    marks: 2,
    estimatedSeconds: 120,
    answer,
    diagram: { type: 'coordinate-grid', data: { dx, dy } },
    solution: {
      finalAnswer: answer,
      steps: [
        { order: 1, explanation: 'A movement without turning or resizing is a translation.' },
        { order: 2, explanation: 'Write the horizontal and vertical movement as a vector.', working: `(${dx}, ${dy})` },
      ],
      markScheme: [
        { marks: 1, description: 'Identifies a translation.' },
        { marks: 1, description: 'Gives the correct vector.' },
      ],
    },
    tags: ['geometry', 'transformations', 'diagram', `year-${year}`, 'phase-028-curriculum'],
  };
}

export function generateSurdsQuestion(year = 11): GeneratedQuestion {
  const n = [8, 18, 32, 50, 72][randomInt(0, 4)];
  const outside = Math.sqrt(n / 2);
  const answer = `${outside}√2`;
  return {
    ...commonQuestionFields(year, 'curr-surds', 'Number', 'Surds'),
    title: 'Simplify a surd',
    questionText: `Simplify √${n}.`,
    type: 'worked',
    difficulty: 5,
    marks: 2,
    estimatedSeconds: 150,
    answer,
    examStyle: true,
    solution: {
      finalAnswer: answer,
      steps: [
        { order: 1, explanation: 'Find the largest square factor.', working: `${n} = ${n / 2} × 2` },
        { order: 2, explanation: 'Take the square root of the square factor.', working: `√${n} = ${outside}√2` },
      ],
      markScheme: [
        { marks: 1, description: 'Finds a square factor.' },
        { marks: 1, description: 'Simplifies the surd.' },
      ],
    },
    tags: ['number', 'surds', 'higher', `year-${year}`, 'phase-028-curriculum'],
  };
}

export const gcseCurriculumGenerators = [
  generateStandardFormQuestion,
  generateIndexLawsQuestion,
  generateSequenceNthTermQuestion,
  generateFactorisingQuadraticQuestion,
  generateQuadraticFormulaMCQ,
  generateDirectProportionQuestion,
  generateInverseProportionQuestion,
  generateBearingQuestion,
  generateCircleAreaQuestion,
  generateVolumeCylinderQuestion,
  generateAnglePolygonQuestion,
  generateMeanFromTableQuestion,
  generateScatterGraphQuestion,
  generateVennProbabilityQuestion,
  generateTransformationQuestion,
  generateSurdsQuestion,
];
