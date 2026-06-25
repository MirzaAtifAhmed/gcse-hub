export const mathsTopics = [
  { name: 'Number', slug: 'number', description: 'Place value, arithmetic and number skills.', years: [7, 8], priority: 10, skills: [
    { name: 'Place value and ordering', slug: 'place-value-ordering', description: 'Read, order and compare numbers.', years: [7, 8], difficulty: 1 },
    { name: 'Arithmetic procedures', slug: 'arithmetic-procedures', description: 'Use efficient arithmetic methods.', years: [7, 8], difficulty: 2 },
  ]},
  { name: 'Fractions, Decimals and Percentages', slug: 'fractions-decimals-percentages', description: 'Convert and calculate with FDP.', years: [7, 8], priority: 9, skills: [
    { name: 'Convert between FDP', slug: 'convert-fdp', description: 'Convert between fractions, decimals and percentages.', years: [7, 8], difficulty: 2 },
    { name: 'Find percentages of amounts', slug: 'percentages-of-amounts', description: 'Calculate percentages of quantities.', years: [7, 8], difficulty: 2 },
  ]},
  { name: 'Algebra', slug: 'algebra', description: 'Expressions, equations and sequences.', years: [7, 8], priority: 10, skills: [
    { name: 'Simplify expressions', slug: 'simplify-expressions', description: 'Collect like terms.', years: [7, 8], difficulty: 2 },
    { name: 'Expand single brackets', slug: 'expand-single-brackets', description: 'Expand expressions such as 3(x + 4).', years: [8], difficulty: 3 },
  ]},
  { name: 'Ratio and Proportion', slug: 'ratio-proportion', description: 'Simplify ratios and share amounts.', years: [7, 8], priority: 9, skills: [
    { name: 'Simplify ratios', slug: 'simplify-ratios', description: 'Simplify ratios by common factor.', years: [7, 8], difficulty: 2 },
    { name: 'Share in a ratio', slug: 'share-in-a-ratio', description: 'Divide an amount into a ratio.', years: [8], difficulty: 3 },
  ]},
  { name: 'Probability', slug: 'probability', description: 'Probability scale and simple probability.', years: [7, 8], priority: 7, skills: [
    { name: 'Simple probability', slug: 'simple-probability', description: 'Find probabilities for equally likely outcomes.', years: [7, 8], difficulty: 2 },
  ]},
] as const;

export const mathsQuestionTemplates = [
  { skillSlug: 'expand-single-brackets', title: 'Expand 4(x + 7)', questionText: 'Expand and simplify: 4(x + 7)', type: 'worked', year: 8, difficulty: 3, marks: 2, estimatedSeconds: 90, answer: '4x + 28', solution: { finalAnswer: '4x + 28', steps: [ { order: 1, explanation: 'Multiply 4 by each term inside the bracket.', working: '4 × x = 4x and 4 × 7 = 28' }, { order: 2, explanation: 'Write the expanded expression.', working: '4(x + 7) = 4x + 28' } ], markScheme: [ { marks: 1, description: 'Correctly multiplies 4 by x.' }, { marks: 1, description: 'Correctly multiplies 4 by 7 and gives 4x + 28.' } ], commonMistakes: ['Writing 4x + 7 instead of multiplying both terms by 4.'] }, tags: ['algebra', 'expanding-brackets', 'year-8'] },
  { skillSlug: 'share-in-a-ratio', title: 'Share £80 in the ratio 3:5', questionText: 'Share £80 in the ratio 3:5.', type: 'worked', year: 8, difficulty: 3, marks: 3, estimatedSeconds: 120, answer: '£30 and £50', solution: { finalAnswer: '£30 and £50', steps: [ { order: 1, explanation: 'Add the parts of the ratio.', working: '3 + 5 = 8 parts' }, { order: 2, explanation: 'Find the value of one part.', working: '£80 ÷ 8 = £10' }, { order: 3, explanation: 'Multiply each ratio part by £10.', working: '3 parts = £30 and 5 parts = £50' } ], markScheme: [ { marks: 1, description: 'Adds ratio parts correctly.' }, { marks: 1, description: 'Finds one part correctly.' }, { marks: 1, description: 'Finds both final shares correctly.' } ], commonMistakes: ['Dividing by 2 because there are two people instead of using total ratio parts.'] }, tags: ['ratio', 'sharing-ratio', 'year-8'] },
  { skillSlug: 'simple-probability', title: 'Probability of rolling an even number', questionText: 'A fair six-sided dice is rolled. What is the probability of rolling an even number?', type: 'short-answer', year: 7, difficulty: 2, marks: 2, estimatedSeconds: 75, answer: '1/2', solution: { finalAnswer: '1/2', steps: [ { order: 1, explanation: 'List the even numbers on a six-sided dice.', working: '2, 4, 6' }, { order: 2, explanation: 'There are 3 favourable outcomes out of 6 possible outcomes.', working: '3/6 = 1/2' } ], markScheme: [ { marks: 1, description: 'Identifies 3 even outcomes.' }, { marks: 1, description: 'Gives probability as 3/6 or 1/2.' } ], commonMistakes: ['Forgetting that 6 is even.', 'Writing 3 instead of a probability.'] }, tags: ['probability', 'dice', 'year-7'] },
] as const;
