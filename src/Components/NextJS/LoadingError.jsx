import React, { useEffect } from 'react';
import 'prismjs/themes/prism.css';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function NextJSLoadingError() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Loading & Error UI</h1>
      <p>
        In the App Router, <code>loading.js</code> wraps the page (or segment) in a Suspense boundary and shows while the page loads. <code>error.js</code> catches errors in that segment and shows a fallback. Both are optional.
      </p>
      <div className="method-section">
        <h2 className="method-title">loading.js</h2>
        <CodeBlock language="javascript" style={atomDark}>
          {`// app/dashboard/loading.js
export default function Loading() {
  return <div className="animate-pulse">Loading dashboard...</div>;
}`}
        </CodeBlock>
        <p>Shown automatically while <code>app/dashboard/page.js</code> (and its async data) is loading.</p>
      </div>
      <div className="method-section">
        <h2 className="method-title">error.js</h2>
        <CodeBlock language="javascript" style={atomDark}>
          {`"use client";

// app/dashboard/error.js
export default function Error({ error, reset }) {
  return (
    <div>
      <p>Something went wrong: {error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}`}
        </CodeBlock>
        <p>Error components must be Client Components. <code>reset()</code> re-renders the segment so the user can retry.</p>
      </div>
    </div>
  );
}

export default NextJSLoadingError;
