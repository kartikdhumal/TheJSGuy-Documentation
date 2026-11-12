import React from 'react';
import '../../styles/ai.css';

function Flow({ label, steps }) {
  return (
    <div className="ai-flow-block">
      {label && <div className="ai-flow-label">{label}</div>}
      <div className="ai-flow">
        {steps.map((step, index) => (
          <React.Fragment key={step.title}>
            {index > 0 && <span className="ai-arrow" aria-hidden="true">→</span>}
            <div className="ai-step">
              <span className="ai-step-title">{step.title}</span>
              {step.text && <span className="ai-step-text">{step.text}</span>}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default Flow;
