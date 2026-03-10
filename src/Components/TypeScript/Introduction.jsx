import React, { useEffect } from 'react';
import 'prismjs/themes/prism.css';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function TypeScriptIntroduction() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Introduction to TypeScript</h1>
      <p>
        TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. It adds optional static types, better tooling, and catches many errors at compile time instead of runtime.
      </p>
      <div className="method-section">
        <h2 className="method-title">Why TypeScript?</h2>
        <ul>
          <li><strong>Type safety:</strong> Catch bugs before they run (typos, wrong argument types, missing properties).</li>
          <li><strong>Better IDE support:</strong> Autocomplete, refactoring, and inline documentation.</li>
          <li><strong>Clearer APIs:</strong> Types document what functions expect and return.</li>
          <li><strong>Easier refactoring:</strong> Change types and fix errors across the codebase.</li>
        </ul>
      </div>
      <div className="method-section">
        <h2 className="method-title">Install and run</h2>
        <CodeBlock language="bash" style={atomDark}>
          {`npm install -g typescript
tsc --version
tsc app.ts    # compiles app.ts to app.js`}
        </CodeBlock>
      </div>
      <div className="method-section">
        <h2 className="method-title">First TypeScript file</h2>
        <CodeBlock language="typescript" style={atomDark}>
          {`// hello.ts
function greet(name: string): string {
  return \`Hello, \${name}!\`;
}
console.log(greet("World"));  // Hello, World!
// greet(42);  // Error: Argument of type 'number' is not assignable to parameter of type 'string'`}
        </CodeBlock>
      </div>
    </div>
  );
}

export default TypeScriptIntroduction;
