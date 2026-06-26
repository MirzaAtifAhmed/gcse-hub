export function normaliseAnswer(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '')
    .replace(/£/g, '')
    .replace(/,/g, '')
    .replace(/°/g, '')
    .replace(/²/g, '2')
    .replace(/³/g, '3')
    .replace(/degrees?/g, '')
    .replace(/degs?/g, '')
    .replace(/squarecentimetres/g, 'cm2')
    .replace(/squarecentimeters/g, 'cm2')
    .replace(/centimetressquared/g, 'cm2')
    .replace(/centimeterssquared/g, 'cm2')
    .replace(/squarecm/g, 'cm2')
    .replace(/sqcm/g, 'cm2')
    .replace(/centimetres/g, 'cm')
    .replace(/centimeters/g, 'cm');
}

export function isAnswerCorrect(userAnswer: string, correctAnswer: string): boolean {
  return normaliseAnswer(userAnswer) === normaliseAnswer(correctAnswer);
}
