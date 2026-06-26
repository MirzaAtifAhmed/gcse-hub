import type { GeneratedQuestion } from '@gcse-hub/types';

type DiagramData = Record<string, unknown>;

function getNumber(data: DiagramData, key: string, fallback: number): number {
  const value = data[key];
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function getString(data: DiagramData, key: string, fallback: string): string {
  const value = data[key];
  return typeof value === 'string' ? value : fallback;
}

function AngleLineDiagram({ data }: { data: DiagramData }) {
  const angle = getNumber(data, 'angle', 65);
  const label = getString(data, 'label', 'x');

  return (
    <svg className="question-diagram-svg" viewBox="0 0 360 160" role="img" aria-label="Angles on a straight line diagram">
      <line x1="35" y1="110" x2="325" y2="110" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <line x1="180" y1="110" x2="95" y2="35" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <path d="M135 110 A45 45 0 0 1 148 76" fill="none" stroke="currentColor" strokeWidth="3" />
      <path d="M205 110 A56 56 0 0 0 155 62" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="5 5" />
      <text x="104" y="96" className="question-diagram-text">{angle}°</text>
      <text x="214" y="89" className="question-diagram-text">{label}</text>
    </svg>
  );
}

function RectangleDiagram({ data }: { data: DiagramData }) {
  const length = getNumber(data, 'length', 12);
  const width = getNumber(data, 'width', 7);
  const unit = getString(data, 'unit', 'cm');

  return (
    <svg className="question-diagram-svg" viewBox="0 0 360 210" role="img" aria-label="Rectangle diagram">
      <rect x="70" y="45" width="220" height="120" rx="8" fill="none" stroke="currentColor" strokeWidth="4" />
      <text x="170" y="190" className="question-diagram-text">{length} {unit}</text>
      <text x="20" y="112" className="question-diagram-text">{width} {unit}</text>
    </svg>
  );
}

function CircleDiagram({ data }: { data: DiagramData }) {
  const radius = getNumber(data, 'radius', 5);
  const unit = getString(data, 'unit', 'cm');

  return (
    <svg className="question-diagram-svg" viewBox="0 0 300 220" role="img" aria-label="Circle diagram">
      <circle cx="150" cy="110" r="72" fill="none" stroke="currentColor" strokeWidth="4" />
      <line x1="150" y1="110" x2="222" y2="110" stroke="currentColor" strokeWidth="3" strokeDasharray="6 6" />
      <circle cx="150" cy="110" r="4" fill="currentColor" />
      <text x="166" y="101" className="question-diagram-text">r = {radius} {unit}</text>
    </svg>
  );
}

function TriangleDiagram({ data }: { data: DiagramData }) {
  const base = getNumber(data, 'base', 10);
  const height = getNumber(data, 'height', 6);
  const unit = getString(data, 'unit', 'cm');

  return (
    <svg className="question-diagram-svg" viewBox="0 0 360 230" role="img" aria-label="Triangle diagram">
      <path d="M70 170 L290 170 L135 45 Z" fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
      <line x1="135" y1="45" x2="135" y2="170" stroke="currentColor" strokeWidth="3" strokeDasharray="6 6" />
      <text x="165" y="205" className="question-diagram-text">base = {base} {unit}</text>
      <text x="145" y="112" className="question-diagram-text">height = {height} {unit}</text>
    </svg>
  );
}

function GenericDiagram({ type }: { type: string }) {
  return (
    <div className="question-diagram-generic">
      <strong>Diagram question</strong>
      <span>{type}</span>
    </div>
  );
}

export function QuestionDiagram({ question }: { question: GeneratedQuestion }) {
  const diagram = (question as GeneratedQuestion & { diagram?: { type?: string; data?: DiagramData } }).diagram;

  if (!diagram || !diagram.type || diagram.type === 'none') {
    return null;
  }

  const data = diagram.data ?? {};

  return (
    <div className="question-diagram">
      {diagram.type === 'angle-line' && <AngleLineDiagram data={data} />}
      {diagram.type === 'rectangle' && <RectangleDiagram data={data} />}
      {diagram.type === 'circle' && <CircleDiagram data={data} />}
      {diagram.type === 'triangle' && <TriangleDiagram data={data} />}
      {!['angle-line', 'rectangle', 'circle', 'triangle'].includes(diagram.type) && <GenericDiagram type={diagram.type} />}
    </div>
  );
}
