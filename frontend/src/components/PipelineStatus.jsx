import { useState, useEffect } from 'react';

const STEP_LABELS = {
  ocr: 'Extract screenshot text',
  ontology: 'Build knowledge graph',
  graph_build: 'Compile agent graph',
  sim_create: 'Initialize simulation world',
  sim_prepare: 'Generate agent profiles',
  sim_run: 'Run Twitter + Reddit simulation',
  report_gen: 'Synthesize prediction report',
  parse: 'Extract prediction metrics',
};

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="8" fill="#22c55e" opacity="0.15" />
      <path d="M4.5 8L7 10.5L11.5 5.5" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function PipelineStatus({ steps, currentStep }) {
  const [barWidth, setBarWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setBarWidth(94), 100);
    return () => {
      clearTimeout(timer);
      setBarWidth(0);
    };
  }, []);

  return (
    <div>
      <div className="pipeline-title">
        <div className="pulse-dot" />
        Simulation running...
      </div>

      <ul className="step-list">
        {steps.map((msg, i) => (
          <li key={i} className="step-item done">
            <span className="step-icon"><CheckIcon /></span>
            {msg}
          </li>
        ))}

        {currentStep && (
          <li className="step-item running">
            <span className="step-icon"><div className="spinner" /></span>
            {currentStep}
          </li>
        )}
      </ul>

      <div className="progress-bar-track">
        <div className="progress-bar-fill" style={{ width: `${barWidth}%` }} />
      </div>
    </div>
  );
}
