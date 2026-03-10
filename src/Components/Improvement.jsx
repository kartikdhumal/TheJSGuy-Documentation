import React, { useEffect } from 'react';
import 'prismjs/themes/prism.css';
import '../styles/debouncing.css';
import CodeBlock from './CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { interviewSections } from '../data/interviewData';

function Improvement() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Interview Questions</h1>

      {interviewSections.map((section, sectionIndex) => (
        <section key={sectionIndex} className="method-section">
          <h2 className="method-title">{section.title}</h2>
          {section.questions.map((item, index) => (
            <div key={index} className="faq-item">
              <h3 className="faq-question">{index + 1}. {item.q}</h3>
              <p className="faq-answer">
                {item.a}
              </p>
              {item.code && (
                <div className="faq-code-wrap">
                  <CodeBlock
                    language="javascript"
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
      ))}
    </div>
  );
}

export default Improvement;
