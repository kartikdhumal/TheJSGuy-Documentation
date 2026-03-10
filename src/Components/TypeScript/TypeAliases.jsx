import React, { useEffect } from 'react';
import 'prismjs/themes/prism.css';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function TypeScriptTypeAliases() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Type Aliases</h1>
      <p>
        A type alias gives a name to a type. You can alias primitives, objects, unions, tuples, and more. Unlike interfaces, type aliases can represent unions and mapped types.
      </p>
      <div className="method-section">
        <h2 className="method-title">Object and union aliases</h2>
        <CodeBlock language="typescript" style={atomDark}>
          {`type ID = string | number;

type User = {
  id: ID;
  name: string;
};

type Status = "pending" | "success" | "error";`}
        </CodeBlock>
      </div>
      <div className="method-section">
        <h2 className="method-title">Alias vs interface</h2>
        <p>Interfaces can be extended and merged (declaration merging). Type aliases can express unions, intersections, and mapped types. Prefer interface for object shapes when you need extension; use type for unions and complex types.</p>
        <CodeBlock language="typescript" style={atomDark}>
          {`type A = { a: number };
type B = { b: string };
type C = A & B;  // intersection`}
        </CodeBlock>
      </div>
    </div>
  );
}

export default TypeScriptTypeAliases;
