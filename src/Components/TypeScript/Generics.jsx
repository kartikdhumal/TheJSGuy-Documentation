import React, { useEffect } from 'react';
import 'prismjs/themes/prism.css';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function TypeScriptGenerics() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Generics</h1>
      <p>
        Generics let you write reusable code that works with multiple types while keeping type safety. You define type parameters (e.g. <code>T</code>) and use them in functions, classes, or type aliases.
      </p>
      <div className="method-section">
        <h2 className="method-title">Generic function</h2>
        <CodeBlock language="typescript" style={atomDark}>
          {`function identity<T>(x: T): T {
  return x;
}
const n = identity(42);     // number
const s = identity("hi");   // string`}
        </CodeBlock>
      </div>
      <div className="method-section">
        <h2 className="method-title">Generic interface and constraint</h2>
        <CodeBlock language="typescript" style={atomDark}>
          {`interface Box<T> {
  value: T;
}

function first<T extends { length: number }>(arr: T): T[0] {
  return arr[0];
}
first([1, 2, 3]);
first("hello");`}
        </CodeBlock>
      </div>
      <div className="method-section">
        <h2 className="method-title">Default type parameter</h2>
        <CodeBlock language="typescript" style={atomDark}>
          {`function create<T = string>(value: T): T {
  return value;
}
const x = create("a");   // string
const y = create(1);     // number`}
        </CodeBlock>
      </div>
    </div>
  );
}

export default TypeScriptGenerics;
