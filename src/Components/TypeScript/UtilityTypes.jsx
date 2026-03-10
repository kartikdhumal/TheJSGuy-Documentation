import React, { useEffect } from 'react';
import 'prismjs/themes/prism.css';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function TypeScriptUtilityTypes() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Utility Types</h1>
      <p>
        TypeScript includes built-in utility types that transform existing types. They are implemented with mapped and conditional types and are very useful for deriving new types from existing ones.
      </p>
      <div className="method-section">
        <h2 className="method-title">Partial, Required, Readonly</h2>
        <CodeBlock language="typescript" style={atomDark}>
          {`interface User { id: number; name: string; }

type PartialUser = Partial<User>;   // { id?: number; name?: string }
type RequiredUser = Required<PartialUser>;
type ReadonlyUser = Readonly<User>;  // readonly id, name`}
        </CodeBlock>
      </div>
      <div className="method-section">
        <h2 className="method-title">Pick, Omit, Record</h2>
        <CodeBlock language="typescript" style={atomDark}>
          {`type NameOnly = Pick<User, "name">;           // { name: string }
type WithoutId = Omit<User, "id">;         // { name: string }
type Page = Record<"home" | "about", string>;  // { home: string; about: string }`}
        </CodeBlock>
      </div>
      <div className="method-section">
        <h2 className="method-title">ReturnType, Parameters</h2>
        <CodeBlock language="typescript" style={atomDark}>
          {`function f(a: number, b: string): boolean { return true; }
type R = ReturnType<typeof f>;        // boolean
type P = Parameters<typeof f>;       // [number, string]`}
        </CodeBlock>
      </div>
    </div>
  );
}

export default TypeScriptUtilityTypes;
