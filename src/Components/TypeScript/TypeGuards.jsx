import React, { useEffect } from 'react';
import 'prismjs/themes/prism.css';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function TypeScriptTypeGuards() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Type Guards</h1>
      <p>
        Type guards are expressions that narrow the type inside a conditional block. You can use <code>typeof</code>, <code>instanceof</code>, <code>in</code>, or custom predicate functions (<code>x is Type</code>) so TypeScript knows the type after the check.
      </p>
      <div className="method-section">
        <h2 className="method-title">typeof and instanceof</h2>
        <CodeBlock language="typescript" style={atomDark}>
          {`function f(x: string | number) {
  if (typeof x === "string") return x.toUpperCase();
  return x.toFixed(2);
}

if (err instanceof Error) console.log(err.message);`}
        </CodeBlock>
      </div>
      <div className="method-section">
        <h2 className="method-title">in operator</h2>
        <CodeBlock language="typescript" style={atomDark}>
          {`type Cat = { meow(): void };
type Dog = { bark(): void };
function sound(animal: Cat | Dog) {
  if ("meow" in animal) animal.meow();
  else animal.bark();
}`}
        </CodeBlock>
      </div>
      <div className="method-section">
        <h2 className="method-title">User-defined type guard</h2>
        <CodeBlock language="typescript" style={atomDark}>
          {`function isString(x: unknown): x is string {
  return typeof x === "string";
}
const val: unknown = getValue();
if (isString(val)) console.log(val.toUpperCase());`}
        </CodeBlock>
      </div>
    </div>
  );
}

export default TypeScriptTypeGuards;
