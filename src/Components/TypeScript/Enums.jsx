import React, { useEffect } from 'react';
import 'prismjs/themes/prism.css';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function TypeScriptEnums() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Enums</h1>
      <p>
        Enums define a set of named constants. TypeScript has numeric and string enums. They compile to objects (numeric) or object-like structures. For simple sets of string values, union of string literals is often preferred.
      </p>
      <div className="method-section">
        <h2 className="method-title">Numeric enum</h2>
        <CodeBlock language="typescript" style={atomDark}>
          {`enum Direction {
  Up,      // 0
  Down,    // 1
  Left,    // 2
  Right,   // 3
}
const d = Direction.Up;  // 0`}
        </CodeBlock>
      </div>
      <div className="method-section">
        <h2 className="method-title">String enum</h2>
        <CodeBlock language="typescript" style={atomDark}>
          {`enum Status {
  Pending = "PENDING",
  Done = "DONE",
  Error = "ERROR",
}`}
        </CodeBlock>
      </div>
      <div className="method-section">
        <h2 className="method-title">const enum</h2>
        <p><code>const enum</code> is inlined at compile time and does not emit a runtime object. Use when you want no runtime cost.</p>
        <CodeBlock language="typescript" style={atomDark}>
          {`const enum Flag {
  A = 1,
  B = 2,
}`}
        </CodeBlock>
      </div>
    </div>
  );
}

export default TypeScriptEnums;
