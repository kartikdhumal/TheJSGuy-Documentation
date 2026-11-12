import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { interviewSections } from '../../data/interviewData';

const aiSection = interviewSections.find((section) => section.title === 'AI & LLMs');

function AIQuestions() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const qa = aiSection ? aiSection.questions : [];

  return (
    <div className="debounce-container">
      <h1 className="title">AI &amp; LLM Questions</h1>
      <p className="com-text">Common questions and answers about LLMs, embeddings, vector search, RAG and agents, in simple English.</p>
      {qa.map((item, index) => (
        <div key={item.q} className="faq-item">
          <h4 className="faq-question">{index + 1}. {item.q}</h4>
          <p className="faq-answer">{item.a}</p>
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
    </div>
  );
}

export default AIQuestions;
