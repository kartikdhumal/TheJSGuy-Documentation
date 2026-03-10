import React, { useEffect } from 'react';
import 'prismjs/themes/prism.css';
import '../../styles/debouncing.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function NextJSServerClientComponents() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Server & Client Components</h1>
      <p>
        In the App Router, every component is a <strong>Server Component</strong> unless you add <code>"use client"</code> at the top. Server Components run on the server only; Client Components run on the server for the initial HTML and then on the client for interactivity.
      </p>
      <div className="method-section">
        <h2 className="method-title">Server Component (default)</h2>
        <p>No directive. Can async and fetch data directly. No useState, useEffect, or browser APIs. Good for data fetching and non-interactive UI.</p>
        <SyntaxHighlighter language="javascript" style={atomDark}>
          {`// app/products/page.js
async function ProductsPage() {
  const res = await fetch('https://api.example.com/products');
  const data = await res.json();
  return (
    <ul>
      {data.map(p => <li key={p.id}>{p.name}</li>)}
    </ul>
  );
}`}
        </SyntaxHighlighter>
      </div>
      <div className="method-section">
        <h2 className="method-title">Client Component</h2>
        <p>Add <code>"use client"</code> when you need hooks, event handlers, or browser APIs. Keep the tree of Client Components small so most of the app stays on the server.</p>
        <SyntaxHighlighter language="javascript" style={atomDark}>
          {`"use client";

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count}
    </button>
  );
}`}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

export default NextJSServerClientComponents;
