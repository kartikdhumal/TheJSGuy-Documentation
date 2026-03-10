import React, { useEffect } from 'react';
import 'prismjs/themes/prism.css';
import '../../styles/debouncing.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function NextJSFileRouting() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">File-based Routing</h1>
      <p>
        In the App Router, the folder structure under <code>app/</code> defines the URL. A <code>page.js</code> inside a folder becomes a route. Nested folders create nested paths.
      </p>
      <div className="method-section">
        <h2 className="method-title">Basic mapping</h2>
        <SyntaxHighlighter language="text" style={atomDark}>
          {`app/page.js           → /
app/about/page.js    → /about
app/blog/page.js     → /blog
app/blog/[slug]/page.js  → /blog/:slug (dynamic)`}
        </SyntaxHighlighter>
      </div>
      <div className="method-section">
        <h2 className="method-title">Dynamic segments</h2>
        <p>A folder named <code>[id]</code> or <code>[slug]</code> is a dynamic segment. You get the value via the <code>params</code> prop in the page component.</p>
        <SyntaxHighlighter language="javascript" style={atomDark}>
          {`// app/users/[id]/page.js
export default function UserPage({ params }) {
  return <h1>User: {params.id}</h1>;
}`}
        </SyntaxHighlighter>
      </div>
      <div className="method-section">
        <h2 className="method-title">Route groups (no URL change)</h2>
        <p>Folders in parentheses like <code>(dashboard)</code> group routes without adding to the URL path.</p>
        <SyntaxHighlighter language="text" style={atomDark}>
          {`app/(dashboard)/settings/page.js  → /settings (not /dashboard/settings)`}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

export default NextJSFileRouting;
