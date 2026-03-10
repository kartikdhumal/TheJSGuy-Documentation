import React, { useEffect } from 'react';
import 'prismjs/themes/prism.css';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function TypeScriptBasicTypes() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Basic Types</h1>
      <p>
        TypeScript provides primitives and built-in types. You annotate variables, parameters, and return types with <code>: Type</code>. TypeScript infers types when you don’t annotate.
      </p>
      <div className="method-section">
        <h2 className="method-title">Primitives</h2>
        <CodeBlock language="typescript" style={atomDark}>
          {`let num: number = 42;
let str: string = "hello";
let flag: boolean = true;
let u: undefined = undefined;
let n: null = null;`}
        </CodeBlock>
      </div>
      <div className="method-section">
        <h2 className="method-title">Arrays and tuples</h2>
        <CodeBlock language="typescript" style={atomDark}>
          {`let arr: number[] = [1, 2, 3];
let list: Array<string> = ["a", "b"];

// Tuple: fixed-length array with known types
let tuple: [string, number] = ["age", 25];
tuple[0];  // string
tuple[1];  // number`}
        </CodeBlock>
      </div>
      <div className="method-section">
        <h2 className="method-title">Functions</h2>
        <CodeBlock language="typescript" style={atomDark}>
          {`function add(a: number, b: number): number {
  return a + b;
}

const mul = (a: number, b: number): number => a * b;`}
        </CodeBlock>
      </div>
      <div className="method-section">
        <h2 className="method-title">any and unknown</h2>
        <p><code>any</code> turns off type checking. <code>unknown</code> is safer: you must narrow the type (e.g. with typeof or type guards) before using it.</p>
        <CodeBlock language="typescript" style={atomDark}>
          {`let x: any = 4;
x = "ok";  // no error

let y: unknown = getData();
if (typeof y === "string") console.log(y.toUpperCase());`}
        </CodeBlock>
      </div>
    </div>
  );
}

export default TypeScriptBasicTypes;
