import React, { useEffect } from 'react';
import 'prismjs/themes/prism.css';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function NextJSAppRouter() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">App Router</h1>
      <p>
        The App Router (Next.js 13+) uses the <code>app/</code> directory. Each folder is a route segment. You use <code>page.js</code> for the UI, <code>layout.js</code> for shared UI, and <code>loading.js</code> / <code>error.js</code> for loading and error states.
      </p>
      <div className="method-section">
        <h2 className="method-title">Pages and layouts</h2>
        <p><code>page.js</code> is the UI for that route. <code>layout.js</code> wraps its children and persists across navigations (so it doesn’t re-mount).</p>
        <CodeBlock language="javascript" style={atomDark}>
          {`// app/page.js
export default function Home() {
  return <h1>Home</h1>;
}

// app/layout.js
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}`}
        </CodeBlock>
      </div>
      <div className="method-section">
        <h2 className="method-title">Server Components by default</h2>
        <p>Components inside <code>app/</code> are Server Components by default: they run on the server. Use <code>"use client"</code> at the top of a file when you need hooks, event handlers, or browser APIs.</p>
      </div>
    </div>
  );
}

export default NextJSAppRouter;
