import type { GeneratedQuestion, QuestionOption } from '@gcse-hub/types';

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function levelForYear(year: number, base: number): 1 | 2 | 3 | 4 | 5 {
  return Math.max(1, Math.min(5, base + Math.max(0, year - 8))) as 1 | 2 | 3 | 4 | 5;
}

function shuffleOptions(options: QuestionOption[]): QuestionOption[] {
  return [...options]
    .map((option) => ({ option, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map((item, index) => ({ ...item.option, id: String.fromCharCode(97 + index) }));
}

export function generateSaleVoucherQuestion(year = 9): GeneratedQuestion {
  const price = randomInt(12, 48) * 5;
  const discount = [10, 15, 20, 25, 30][randomInt(0, 4)];
  const voucher = year >= 10 ? randomInt(2, 10) * 2 : 0;
  const discounted = price * (1 - discount / 100);
  const final = discounted - voucher;
  const answer = voucher ? `£${final}` : `£${discounted}`;

  return {
    id: createId('gcse-sale-voucher'),
    title: 'Percentage discount in context',
    questionText: voucher
      ? `A jacket costs £${price}. It is reduced by ${discount}% in a sale. A customer also uses a £${voucher} voucher. Work out the final amount paid.`
      : `A jacket costs £${price}. It is reduced by ${discount}% in a sale. Work out the sale price.`,
    topic: 'Fractions, Decimals and Percentages',
    skill: 'Percentage change in context',
    type: 'worked',
    year,
    difficulty: levelForYear(year, voucher ? 4 : 3),
    marks: voucher ? 4 : 3,
    estimatedSeconds: voucher ? 240 : 180,
    answer,
    calculatorAllowed: true,
    examStyle: true,
    solution: {
      finalAnswer: answer,
      steps: [
        { order: 1, explanation: `Find ${discount}% of £${price}.`, working: `${price} × ${discount / 100} = £${price * discount / 100}` },
        { order: 2, explanation: 'Subtract the discount from the original price.', working: `£${price} - £${price * discount / 100} = £${discounted}` },
        ...(voucher ? [{ order: 3, explanation: 'Subtract the voucher.', working: `£${discounted} - £${voucher} = £${final}` }] : []),
      ],
      markScheme: [
        { marks: 1, description: 'Finds the percentage discount.' },
        { marks: 1, description: 'Subtracts the discount from the original price.' },
        ...(voucher ? [{ marks: 1, description: 'Subtracts the voucher after the sale reduction.' }] : []),
        { marks: 1, description: 'Gives the final money answer.' },
      ],
      commonMistakes: ['Adding the discount instead of subtracting it.', 'Applying the voucher before the percentage discount.'],
    },
    tags: ['percentages', 'money', 'exam-style', `year-${year}`],
  };
}

export function generateRecipeScaleQuestion(year = 8): GeneratedQuestion {
  const serves = [4, 5, 6][randomInt(0, 2)];
  const target = serves * randomInt(2, year >= 10 ? 5 : 4);
  const flour = randomInt(12, 30) * 10;
  const sugar = randomInt(4, 12) * 10;
  const scale = target / serves;
  const answerFlour = flour * scale;
  const answerSugar = sugar * scale;

  return {
    id: createId('gcse-recipe-scale'),
    title: 'Scale a recipe',
    questionText: `A recipe serves ${serves} people and uses ${flour} g of flour and ${sugar} g of sugar. How much flour and sugar are needed to serve ${target} people?`,
    topic: 'Ratio and Proportion',
    skill: 'Direct proportion in a recipe context',
    type: 'worked',
    year,
    difficulty: levelForYear(year, 3),
    marks: 4,
    estimatedSeconds: 210,
    answer: `${answerFlour} g flour and ${answerSugar} g sugar`,
    solution: {
      finalAnswer: `${answerFlour} g flour and ${answerSugar} g sugar`,
      steps: [
        { order: 1, explanation: 'Find the scale factor.', working: `${target} ÷ ${serves} = ${scale}` },
        { order: 2, explanation: 'Multiply the flour by the scale factor.', working: `${flour} × ${scale} = ${answerFlour} g` },
        { order: 3, explanation: 'Multiply the sugar by the scale factor.', working: `${sugar} × ${scale} = ${answerSugar} g` },
      ],
      markScheme: [
        { marks: 1, description: 'Finds correct scale factor.' },
        { marks: 1, description: 'Correct flour amount.' },
        { marks: 1, description: 'Correct sugar amount.' },
        { marks: 1, description: 'Includes units and clear final answer.' },
      ],
      commonMistakes: ['Adding ingredients instead of multiplying by the scale factor.'],
    },
    tags: ['ratio', 'proportion', 'real-world', `year-${year}`],
  };
}

export function generateTriangleAreaQuestion(year = 9): GeneratedQuestion {
  const base = randomInt(6, 18);
  const height = randomInt(4, 14);
  const answer = (base * height) / 2;

  return {
    id: createId('gcse-triangle-area'),
    title: 'Area of a triangle',
    questionText: `The diagram shows a triangle with base ${base} cm and perpendicular height ${height} cm. Calculate the area of the triangle.`,
    topic: 'Area',
    skill: 'Area of triangles',
    type: 'worked',
    year,
    difficulty: levelForYear(year, 2),
    marks: 3,
    estimatedSeconds: 150,
    answer: `${answer} cm²`,
    diagram: { type: 'triangle', data: { base, height, unit: 'cm' } },
    solution: {
      finalAnswer: `${answer} cm²`,
      steps: [
        { order: 1, explanation: 'Use area of a triangle = 1/2 × base × height.', working: `1/2 × ${base} × ${height}` },
        { order: 2, explanation: 'Calculate the area.', working: `${answer} cm²` },
      ],
      markScheme: [
        { marks: 1, description: 'Uses the correct triangle area formula.' },
        { marks: 1, description: 'Substitutes the base and height correctly.' },
        { marks: 1, description: 'Calculates the correct area with units.' },
      ],
      commonMistakes: ['Forgetting to halve the rectangle area.'],
    },
    tags: ['geometry', 'area', 'diagram', `year-${year}`],
  };
}

export function generateCircleAreaQuestion(year = 10): GeneratedQuestion {
  const radius = randomInt(3, 12);
  const answer = Math.round(Math.PI * radius * radius * 10) / 10;

  return {
    id: createId('gcse-circle-area'),
    title: 'Area of a circle',
    questionText: `A circular badge has radius ${radius} cm. Calculate its area to 1 decimal place.`,
    topic: 'Area',
    skill: 'Area of circles',
    type: 'worked',
    year,
    difficulty: levelForYear(year, 3),
    marks: 3,
    estimatedSeconds: 180,
    answer: `${answer} cm²`,
    diagram: { type: 'circle', data: { radius, unit: 'cm' } },
    calculatorAllowed: true,
    examStyle: true,
    solution: {
      finalAnswer: `${answer} cm²`,
      steps: [
        { order: 1, explanation: 'Use area of a circle = πr².', working: `π × ${radius}²` },
        { order: 2, explanation: 'Calculate and round to 1 decimal place.', working: `${answer} cm²` },
      ],
      markScheme: [
        { marks: 1, description: 'Uses the circle area formula.' },
        { marks: 1, description: 'Substitutes the radius correctly.' },
        { marks: 1, description: 'Correct rounded answer with units.' },
      ],
      commonMistakes: ['Using diameter instead of radius.', 'Forgetting to square the radius.'],
    },
    tags: ['geometry', 'circle', 'calculator', `year-${year}`],
  };
}

export function generateMeanFromTableQuestion(year = 9): GeneratedQuestion {
  const values = [2, 3, 4, 5];
  const frequencies = values.map(() => randomInt(1, year >= 10 ? 8 : 5));
  const totalFrequency = frequencies.reduce((sum, item) => sum + item, 0);
  const total = values.reduce((sum, value, index) => sum + value * frequencies[index], 0);
  const mean = Math.round((total / totalFrequency) * 100) / 100;

  return {
    id: createId('gcse-mean-table'),
    title: 'Mean from a frequency table',
    questionText: `A teacher records scores out of 5. Score 2 occurs ${frequencies[0]} times, score 3 occurs ${frequencies[1]} times, score 4 occurs ${frequencies[2]} times and score 5 occurs ${frequencies[3]} times. Work out the mean score.`,
    topic: 'Statistics',
    skill: 'Mean from grouped frequency information',
    type: 'worked',
    year,
    difficulty: levelForYear(year, 4),
    marks: 4,
    estimatedSeconds: 240,
    answer: String(mean),
    solution: {
      finalAnswer: String(mean),
      steps: [
        { order: 1, explanation: 'Multiply each score by its frequency.', working: values.map((value, index) => `${value} × ${frequencies[index]}`).join(', ') },
        { order: 2, explanation: 'Add the totals.', working: `${total}` },
        { order: 3, explanation: 'Divide by the total frequency.', working: `${total} ÷ ${totalFrequency} = ${mean}` },
      ],
      markScheme: [
        { marks: 1, description: 'Multiplies scores by frequencies.' },
        { marks: 1, description: 'Finds total of score × frequency.' },
        { marks: 1, description: 'Finds total frequency.' },
        { marks: 1, description: 'Correct mean.' },
      ],
      commonMistakes: ['Dividing by the number of different scores instead of the total frequency.'],
    },
    tags: ['statistics', 'mean', 'frequency', `year-${year}`],
  };
}

export function generateBestValueQuestion(year = 10): GeneratedQuestion {
  const smallWeight = 300;
  const largeWeight = 750;
  const smallPrice = randomInt(6, 10) / 2;
  const largePrice = Math.round((smallPrice * 2.2 + randomInt(-3, 3) / 10) * 100) / 100;
  const smallPer100 = Math.round((smallPrice / smallWeight) * 100 * 100) / 100;
  const largePer100 = Math.round((largePrice / largeWeight) * 100 * 100) / 100;
  const answer = smallPer100 < largePer100 ? 'small pack' : 'large pack';

  return {
    id: createId('gcse-best-value'),
    title: 'Best value comparison',
    questionText: `A ${smallWeight} g pack costs £${smallPrice.toFixed(2)}. A ${largeWeight} g pack costs £${largePrice.toFixed(2)}. Which pack is better value for money? Show your working.`,
    topic: 'Ratio and Proportion',
    skill: 'Best value and unit pricing',
    type: 'worked',
    year,
    difficulty: levelForYear(year, 4),
    marks: 4,
    estimatedSeconds: 270,
    answer,
    calculatorAllowed: true,
    examStyle: true,
    solution: {
      finalAnswer: answer,
      steps: [
        { order: 1, explanation: 'Compare prices per 100 g.', working: `Small: £${smallPrice.toFixed(2)} ÷ ${smallWeight} × 100 = £${smallPer100}` },
        { order: 2, explanation: 'Calculate the large pack price per 100 g.', working: `Large: £${largePrice.toFixed(2)} ÷ ${largeWeight} × 100 = £${largePer100}` },
        { order: 3, explanation: 'The lower price per 100 g is better value.', working: answer },
      ],
      markScheme: [
        { marks: 1, description: 'Chooses a valid comparison method.' },
        { marks: 1, description: 'Calculates small pack unit price.' },
        { marks: 1, description: 'Calculates large pack unit price.' },
        { marks: 1, description: 'Correct conclusion with evidence.' },
      ],
      commonMistakes: ['Choosing the cheaper pack without considering weight.'],
    },
    tags: ['ratio', 'proportion', 'money', 'reasoning', `year-${year}`],
  };
}

export function generateAlgebraSubstitutionMcq(year = 8): GeneratedQuestion {
  const x = randomInt(2, 9);
  const a = randomInt(2, 6);
  const b = randomInt(1, 12);
  const answer = a * x + b;
  const options = shuffleOptions([
    { id: 'a', label: String(answer), value: String(answer) },
    { id: 'b', label: String(a + x + b), value: String(a + x + b) },
    { id: 'c', label: String(a * (x + b)), value: String(a * (x + b)) },
    { id: 'd', label: String(a * x - b), value: String(a * x - b) },
  ]);

  return {
    id: createId('gcse-algebra-substitution-mcq'),
    title: 'Substitution multiple choice',
    questionText: `When x = ${x}, what is the value of ${a}x + ${b}?`,
    topic: 'Algebra',
    skill: 'Substitution',
    type: 'multiple-choice',
    year,
    difficulty: levelForYear(year, 2),
    marks: 1,
    estimatedSeconds: 60,
    answer: String(answer),
    options,
    solution: {
      finalAnswer: String(answer),
      steps: [
        { order: 1, explanation: `Substitute x = ${x}.`, working: `${a} × ${x} + ${b}` },
        { order: 2, explanation: 'Calculate using multiplication before addition.', working: `${a * x} + ${b} = ${answer}` },
      ],
      markScheme: [{ marks: 1, description: 'Selects the correct value.' }],
      commonMistakes: ['Adding before multiplying.'],
    },
    tags: ['algebra', 'mcq', `year-${year}`],
  };
}

export const gcseExamStyleGenerators = [
  generateSaleVoucherQuestion,
  generateRecipeScaleQuestion,
  generateTriangleAreaQuestion,
  generateCircleAreaQuestion,
  generateMeanFromTableQuestion,
  generateBestValueQuestion,
  generateAlgebraSubstitutionMcq,
];
