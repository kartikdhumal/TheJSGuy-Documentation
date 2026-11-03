import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { interviewSections } from '../../data/interviewData';

const parts = [
  { id: 'hld-questions', heading: 'HLD (High-Level Design) Questions', title: 'System Design - HLD' },
  { id: 'lld-questions', heading: 'LLD (Low-Level Design) Questions', title: 'System Design - LLD' },
];

function SystemDesignQuestions() {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">System Design Questions</h1>
      <p className="com-text">Common HLD and LLD interview questions with short answers, in simple English.</p>
      {parts.map((part) => {
        const section = interviewSections.find((s) => s.title === part.title);
        const qa = section ? section.questions : [];
        return (
          <section key={part.id} id={part.id} className="method-section">
            <h2 className="method-title">{part.heading}</h2>
            {qa.map((item, index) => (
              <div key={item.q} className="faq-item">
                <h4 className="faq-question">{index + 1}. {item.q}</h4>
                <p className="faq-answer">{item.a}</p>
                {item.code && (
                  <div className="faq-code-wrap">
                    <CodeBlock
                      language={item.lang || 'javascript'}
                      style={atomDark}
                      customStyle={{ margin: 0, borderRadius: '8px', fontSize: '13px' }}
                      showLineNumbers={false}
                    >
                      {item.code}
                    </CodeBlock>
                  </div>
                )}
              </div>
            ))}
          </section>
        );
      })}
    </div>
  );
}

export default SystemDesignQuestions;
