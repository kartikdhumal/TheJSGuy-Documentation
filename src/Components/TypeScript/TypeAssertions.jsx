import React, { useEffect } from 'react';
import 'prismjs/themes/prism.css';
import '../../styles/debouncing.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function TypeScriptTypeAssertions() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Type Assertions</h1>
      <p>
        Type assertions tell the compiler to treat a value as a specific type: <code>value as Type</code> or <code>&lt;Type&gt;value</code>. They don’t change runtime behavior; use only when you know more about the type than TypeScript can infer (e.g. DOM, API responses).
      </p>
      <div className="method-section">
        <h2 className="method-title">as syntax</h2>
        <SyntaxHighlighter language="typescript" style={atomDark}>
          {`const input = document.getElementById("input") as HTMLInputElement;
input.value = "hello";

const data = await response.json() as { id: number; name: string };`}
        </SyntaxHighlighter>
      </div>
      <div className="method-section">
        <h2 className="method-title">Double assertion (avoid when possible)</h2>
        <p>Asserting to <code>unknown</code> first is required when the types are not related enough for a direct assertion.</p>
        <SyntaxHighlighter language="typescript" style={atomDark}>
          {`const x = "hello" as unknown as number;  // escape hatch`}
        </SyntaxHighlighter>
      </div>
      <div className="method-section">
        <h2 className="method-title">const assertion</h2>
        <p><code>as const</code> makes the value readonly and narrows literals to their specific types.</p>
        <SyntaxHighlighter language="typescript" style={atomDark}>
          {`const arr = [1, 2, 3] as const;  // readonly [1, 2, 3]
const o = { a: 1 } as const;   // { readonly a: 1 }`}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

export default TypeScriptTypeAssertions;
