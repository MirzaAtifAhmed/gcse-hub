import type { QuestionSolution } from '@gcse-hub/types';

export function SolutionPanel({ solution }: { solution: QuestionSolution }) {
  return (
    <div className="success-box">
      <h4>Worked solution</h4>
      <p>
        Final answer: <strong>{solution.finalAnswer}</strong>
      </p>
      <ol>
        {solution.steps.map((step) => (
          <li key={step.order}>
            {step.explanation} {step.working && <code>{step.working}</code>}
          </li>
        ))}
      </ol>

      <h4>Mark scheme</h4>
      <ul>
        {solution.markScheme.map((point) => (
          <li key={point.description}>
            {point.marks} mark(s): {point.description}
          </li>
        ))}
      </ul>

      {solution.commonMistakes && solution.commonMistakes.length > 0 && (
        <>
          <h4>Common mistakes</h4>
          <ul>
            {solution.commonMistakes.map((mistake) => (
              <li key={mistake}>{mistake}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
