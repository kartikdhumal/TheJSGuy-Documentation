import React, { useEffect } from 'react';
import 'prismjs/themes/prism.css';
import '../../styles/debouncing.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function NextJSSSGSSRISR() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">SSG, SSR & ISR</h1>
      <p>
        Next.js supports three rendering modes: <strong>Static</strong> (build time), <strong>Dynamic</strong> (per request), and <strong>ISR</strong> (static with revalidation).
      </p>
      <div className="method-section">
        <h2 className="method-title">Static Generation (SSG)</h2>
        <p>Pages are built at build time and served as static HTML. Default when you don’t use dynamic functions (cookies, headers, searchParams) and don’t opt into dynamic. Good for marketing pages, blogs.</p>
        <SyntaxHighlighter language="javascript" style={atomDark}>
          {`// Fetched at build time by default
async function Page() {
  const res = await fetch('https://api.example.com/data');
  const data = await res.json();
  return <div>{data.title}</div>;
}`}
        </SyntaxHighlighter>
      </div>
      <div className="method-section">
        <h2 className="method-title">Server-Side Rendering (SSR)</h2>
        <p>Page is rendered on the server on each request. Use when you need fresh data or request-specific data (cookies, headers). Force it with <code>export const dynamic = 'force-dynamic'</code> or by using <code>cookies()</code> / <code>headers()</code>.</p>
        <SyntaxHighlighter language="javascript" style={atomDark}>
          {`import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const cookieStore = await cookies();
  const theme = cookieStore.get('theme');
  return <div>Theme: {theme?.value}</div>;
}`}
        </SyntaxHighlighter>
      </div>
      <div className="method-section">
        <h2 className="method-title">Incremental Static Regeneration (ISR)</h2>
        <p>Page is static but revalidated after a time or on demand. Use <code>revalidate</code> in fetch or <code>export const revalidate = 60</code> (seconds).</p>
        <SyntaxHighlighter language="javascript" style={atomDark}>
          {`export const revalidate = 60;  // revalidate at most every 60 seconds

export default async function Page() {
  const res = await fetch('https://api.example.com/data');
  const data = await res.json();
  return <div>{data.title}</div>;
}`}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

export default NextJSSSGSSRISR;
