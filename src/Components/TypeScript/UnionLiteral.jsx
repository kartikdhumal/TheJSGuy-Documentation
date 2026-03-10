import React, { useEffect } from 'react';
import 'prismjs/themes/prism.css';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function TypeScriptUnionLiteral() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Union & Literal Types</h1>
      <p>
        A <strong>union type</strong> is <code>A | B</code>: a value can be of type A or B. A <strong>literal type</strong> is a specific value (e.g. <code>"hello"</code> or <code>42</code>). Together they model enums-like choices and discriminated unions.
      </p>
      <div className="method-section">
        <h2 className="method-title">Union types</h2>
        <CodeBlock language="typescript" style={atomDark}>
          {`function pad(value: string | number): string {
  if (typeof value === "number") return value.toString().padStart(2, "0");
  return value.padStart(2, "0");
}`}
        </CodeBlock>
      </div>
      <div className="method-section">
        <h2 className="method-title">Literal types</h2>
        <CodeBlock language="typescript" style={atomDark}>
          {`type Direction = "up" | "down" | "left" | "right";
type Dice = 1 | 2 | 3 | 4 | 5 | 6;

function move(d: Direction) { /* ... */ }
move("up");   // ok
move("north"); // error`}
        </CodeBlock>
      </div>
      <div className="method-section">
        <h2 className="method-title">Discriminated unions</h2>
        <p>Use a common literal property to narrow the union in type guards.</p>
        <CodeBlock language="typescript" style={atomDark}>
          {`type Result = 
  | { kind: "ok"; data: string }
  | { kind: "error"; message: string };

function handle(r: Result) {
  if (r.kind === "ok") console.log(r.data);
  else console.log(r.message);
}`}
        </CodeBlock>
      </div>
    </div>
  );
}

export default TypeScriptUnionLiteral;
