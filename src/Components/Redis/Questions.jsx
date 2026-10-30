import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { interviewSections } from '../../data/interviewData';

const redisSection = interviewSections.find((section) => section.title === 'Redis & BullMQ');

function RedisQuestions() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const qa = redisSection ? redisSection.questions : [];

  return (
    <div className="debounce-container">
      <h1 className="title">Redis &amp; BullMQ Questions</h1>
      <p className="com-text">Common questions and answers about Redis and BullMQ, in simple English.</p>
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

export default RedisQuestions;
