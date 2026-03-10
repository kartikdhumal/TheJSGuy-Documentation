import React, { useEffect } from 'react';
import 'prismjs/themes/prism.css';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function TypeScriptInterfaces() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Interfaces</h1>
      <p>
        Interfaces describe the shape of an object: property names and their types. They support optional properties (<code>?</code>), readonly, and extension. TypeScript checks that objects satisfy the interface.
      </p>
      <div className="method-section">
        <h2 className="method-title">Basic interface</h2>
        <CodeBlock language="typescript" style={atomDark}>
          {`interface User {
  id: number;
  name: string;
  email?: string;  // optional
}

const u: User = { id: 1, name: "Alice" };
// u.email is string | undefined`}
        </CodeBlock>
      </div>
      <div className="method-section">
        <h2 className="method-title">Readonly and extension</h2>
        <CodeBlock language="typescript" style={atomDark}>
          {`interface Point {
  readonly x: number;
  readonly y: number;
}

interface Admin extends User {
  role: "admin";
}`}
        </CodeBlock>
      </div>
      <div className="method-section">
        <h2 className="method-title">Function and index signatures</h2>
        <CodeBlock language="typescript" style={atomDark}>
          {`interface FnMap {
  (x: number): string;
}

interface Dict {
  [key: string]: number;
}
const d: Dict = { a: 1, b: 2 };`}
        </CodeBlock>
      </div>
    </div>
  );
}

export default TypeScriptInterfaces;
